import React, { useState, useEffect, useRef } from "react";
import { CellMeta } from "./CellMeta/CellMeta";
import { PaintBrush } from "./PaintBrush/PaintBrush";
import { useSelector, useDispatch } from "react-redux";
import { listenToSlidersEvents } from "../../../redux/actions";
import {
    _proccessAccessData,
    _proccessGridData,
    _postMapEditsToCityIO,
    testHex,
    hexToRgb,
} from "./BaseMapUtils";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { TripsLayer } from "@deck.gl/geo-layers";
import "mapbox-gl/dist/mapbox-gl.css";
import { HeatmapLayer, PathLayer, GeoJsonLayer } from "deck.gl";
import { LightingEffect, AmbientLight, _SunLight } from "@deck.gl/core";
import settings from "../../../settings/settings.json";
import { _hexToRgb } from "../../GridEditor/EditorMap/EditorMap";
import AnimationComponent from "./AnimationComponent";

export default function Map(props) {
    const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
    const [selectedCellsState, setSelectedCellsState] = useState(null);
    const [viewState, setViewState] = useState(settings.map.initialViewState);
    const [keyDownState, setKeyDownState] = useState(null);
    const [mousePos, setMousePos] = useState(null);
    const [mouseDown, setMouseDown] = useState(null);
    const [hoveredObj, setHoveredObj] = useState(null);
    const [access, setAccess] = useState(null);
    const [GEOGRID, setGEOGRID] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const effects = useRef();

    const dispatch = useDispatch();

    const pickingRadius = 40;

    const [
        cityioData,
        sliders,
        menu,
        accessToggle,
        selectedType,
        ABMmode,
    ] = useSelector((state) => [
        state.CITYIO,
        state.SLIDERS,
        state.MENU,
        state.ACCESS_TOGGLE,
        state.SELECTED_TYPE,
        state.ABM_MODE,
    ]);

    var ABMOn = menu.includes("ABM");
    var rotateOn = menu.includes("ROTATE");
    var shadowsOn = menu.includes("SHADOWS");
    var editOn = menu.includes("EDIT");
    var resetViewOn = menu.includes("RESET_VIEW");

    useEffect(() => {
        // fix deck view rotate
        _rightClickViewRotate();
        // setup sun effects
        _setupSunEffects();
        // zoom map on CS table location
        _setViewStateToTableHeader();
        setLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loaded) return;
        updateSunDirection(sliders.time[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sliders.time]);

    useEffect(() => {
        if (!loaded) return;
        let shadowColor = shadowsOn ? [0, 0, 0, 0.5] : [0, 0, 0, 0];
        effects.current[0].shadowColor = shadowColor;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shadowsOn]);

    useEffect(() => {
        setGEOGRID(_proccessGridData(cityioData));

        if (cityioData.access) {
            setAccess(_proccessAccessData(cityioData));
        }
    }, [cityioData]);

    useEffect(() => {
        if (!loaded) return;
        if (!editOn) {
            let dataProps = [];

            for (let i = 0; i < GEOGRID.features.length; i++) {
                dataProps[i] = GEOGRID.features[i].properties;
            }
            _postMapEditsToCityIO(
                dataProps,
                cityioData.tableName,
                "/GEOGRIDDATA"
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editOn]);

    useEffect(() => {
        if (!loaded) return;
        if (resetViewOn) {
            _setViewStateToTableHeader();
        } else {
            setViewState({
                ...viewState,
                pitch: 45,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetViewOn]);

    const onViewStateChange = ({ viewState }) => {
        viewState.orthographic = menu.includes("RESET_VIEW") ? true : false;
        setViewState(viewState);
    };

    // /**
    //  * resets the camera viewport
    //  * to cityIO header data
    //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
    //  */
    const _setViewStateToTableHeader = () => {
        const header = cityioData.GEOGRID.properties.header;

        setViewState({
            ...viewState,
            longitude: header.longitude,
            latitude: header.latitude,
            zoom: 15,
            pitch: 0,
            bearing: 360 - header.rotation,
            orthographic: true,
        });
    };

    const _setupSunEffects = () => {
        const ambientLight = new AmbientLight({
            color: [255, 255, 255],
            intensity: 0.85,
        });
        const dirLight = new _SunLight({
            timestamp: 1554927200000,
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true,
        });
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.5];
        effects.current = [lightingEffect];
    };

    const updateSunDirection = (time) => {
        var currentDateMidnight = new Date();
        currentDateMidnight.setHours(0, 0, 0, 0);
        var date = new Date(currentDateMidnight.getTime() + time * 1000);
        effects.current[0].directionalLights[0].timestamp = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDay(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );
    };

    // /**
    //  * Description. fix deck issue
    //  * with rotate right botton
    //  */
    const _rightClickViewRotate = () => {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", (evt) => evt.preventDefault());
    };

    // /**
    //  * Description. uses deck api to
    //  * collect objects in a region
    //  * @argument{object} e  picking event
    //  */
    const _multipleObjPicked = (e) => {
        const dim = pickingRadius;
        const x = e.x - dim / 2;
        const y = e.y - dim / 2;
        let multipleObj = deckGL.current.pickObjects({
            x: x,
            y: y,
            width: dim,
            height: dim,
        });
        return multipleObj;
    };

    // /**
    //  * Description. allow only to pick cells that are
    //  *  not of CityScope TUI & that are interactable
    //  * so to not overlap TUI activity
    //  */
    const _handleGridcellEditing = (e) => {
        const { height, color, name } = selectedType;
        const multiSelectedObj = _multipleObjPicked(e);
        multiSelectedObj.forEach((selected) => {
            const thisCellProps = selected.object.properties;
            if (thisCellProps && thisCellProps.interactive) {
                thisCellProps.color = testHex(color) ? hexToRgb(color) : color;
                thisCellProps.height = height;
                thisCellProps.name = name;
            }
        });
        setSelectedCellsState(multiSelectedObj);
    };

    // /**
    //  * Description.
    //  * draw target area around mouse
    //  */

    const _renderPaintBrush = () => {
        if (menu.includes("EDIT")) {
            return (
                selectedType && (
                    <PaintBrush
                        mousePos={mousePos}
                        selectedType={selectedType}
                        divSize={pickingRadius}
                        mouseDown={mouseDown}
                        hoveredCells={hoveredObj}
                    />
                )
            );
        } else {
            return (
                hoveredObj && (
                    <CellMeta mousePos={mousePos} hoveredObj={hoveredObj} />
                )
            );
        }
    };

    // /**
    //  * remap line width
    //  */
    const _remapValues = (value) => {
        let remap =
            value > 15 && value < 25 ? 3 : value < 15 && value > 10 ? 12 : 30;
        return remap;
    };

    // /**
    //  * renders deck gl layers
    //  */
    const _renderLayers = () => {
        const zoomLevel = viewState.zoom;

        let layers = [];

        if (menu.includes("ABM")) {
            layers.push(
                new TripsLayer({
                    id: "ABM",
                    visible: menu.includes("ABM") ? true : false,
                    data: cityioData.ABM2.trips,
                    getPath: (d) => d.path,
                    getTimestamps: (d) => d.timestamps,
                    getColor: (d) => {
                        let col = _hexToRgb(
                            cityioData.ABM2.attr[ABMmode][d[ABMmode]].color
                        );
                        return col;
                    },

                    getWidth: 1,
                    widthScale: _remapValues(zoomLevel),
                    opacity: 0.8,
                    rounded: true,
                    trailLength: 500,
                    currentTime: sliders.time[1],

                    updateTriggers: {
                        getColor: ABMmode,
                    },
                    transitions: {
                        getColor: 500,
                    },
                })
            );
        }

        if (menu.includes("AGGREGATED_TRIPS")) {
            layers.push(
                new PathLayer({
                    id: "AGGREGATED_TRIPS",
                    visible: menu.includes("AGGREGATED_TRIPS") ? true : false,
                    _shadow: false,
                    data: cityioData.ABM2.trips,
                    getPath: (d) => {
                        const noisePath =
                            Math.random() < 0.5
                                ? Math.random() * 0.00005
                                : Math.random() * -0.00005;
                        for (let i in d.path) {
                            d.path[i][0] = d.path[i][0] + noisePath;
                            d.path[i][1] = d.path[i][1] + noisePath;
                            d.path[i][2] = d.mode[0] * 2;
                        }
                        return d.path;
                    },
                    getColor: (d) => {
                        let col = _hexToRgb(
                            cityioData.ABM2.attr[ABMmode][d[ABMmode]].color
                        );
                        return col;
                    },
                    opacity: 0.2,
                    getWidth: 1.5,

                    updateTriggers: {
                        getColor: ABMmode,
                    },
                    transitions: {
                        getColor: 500,
                    },
                })
            );
        }

        if (menu.includes("GRID")) {
            layers.push(
                new GeoJsonLayer({
                    id: "GRID",
                    data: GEOGRID,
                    visible: menu.includes("GRID") ? true : false,
                    pickable: true,
                    extruded: true,
                    wireframe: true,
                    lineWidthScale: 1,
                    lineWidthMinPixels: 2,
                    getElevation: (d) => d.properties.height,
                    getFillColor: (d) => d.properties.color,

                    onClick: (event) => {
                        if (
                            selectedType &&
                            menu.includes("EDIT") &&
                            keyDownState !== "Shift"
                        )
                            _handleGridcellEditing(event);
                    },

                    onDrag: (event) => {
                        if (
                            selectedType &&
                            menu.includes("EDIT") &&
                            keyDownState !== "Shift"
                        )
                            _handleGridcellEditing(event);
                    },

                    onDragStart: () => {
                        if (
                            selectedType &&
                            menu.includes("EDIT") &&
                            keyDownState !== "Shift"
                        ) {
                            setDraggingWhileEditing(true);
                        }
                    },

                    onHover: (e) => {
                        if (e.object) {
                            setHoveredObj(e);
                        }
                    },

                    onDragEnd: () => {
                        setDraggingWhileEditing(false);
                    },
                    updateTriggers: {
                        getFillColor: selectedCellsState,
                        getElevation: selectedCellsState,
                    },
                    transitions: {
                        getFillColor: 500,
                        getElevation: 500,
                    },
                })
            );
        }

        if (menu.includes("ACCESS")) {
            layers.push(
                new HeatmapLayer({
                    id: "ACCESS",
                    visible: menu.includes("ACCESS"),
                    colorRange: settings.map.layers.heatmap.colors,
                    radiusPixels: 200,
                    opacity: 0.25,
                    data: access,
                    getPosition: (d) => d.coordinates,
                    getWeight: (d) => d.values[accessToggle],
                    updateTriggers: {
                        getWeight: [accessToggle],
                    },
                })
            );
        }

        return layers;
    };

    const deckGL = useRef();

    return (
        <div
            className="baseMap"
            onKeyDown={(e) => {
                setKeyDownState(e.nativeEvent.key);
            }}
            onKeyUp={() => setKeyDownState(null)}
            onMouseMove={(e) => setMousePos(e.nativeEvent)}
            onMouseUp={() => setMouseDown(false)}
            onMouseDown={() => setMouseDown(true)}
        >
            <>{_renderPaintBrush()}</>
            <AnimationComponent
                toggles={{ ABMOn, rotateOn }}
                state={{ sliders, viewState }}
                updaters={{
                    listenToSlidersEvents,
                    updateSunDirection,
                    setViewState,
                }}
                dispatch={dispatch}
            />

            <DeckGL
                ref={deckGL}
                viewState={viewState}
                onViewStateChange={onViewStateChange}
                layers={_renderLayers()}
                effects={effects.current}
                controller={{
                    touchZoom: true,
                    touchRotate: true,
                    dragPan: !draggingWhileEditing,
                    dragRotate: !draggingWhileEditing,
                    keyboard: false,
                }}
            >
                <StaticMap
                    asyncRender={false}
                    dragRotate={true}
                    reuseMaps={true}
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={settings.map.mapStyle.blue}
                    preventStyleDiffing={true}
                />
            </DeckGL>
        </div>
    );
}
