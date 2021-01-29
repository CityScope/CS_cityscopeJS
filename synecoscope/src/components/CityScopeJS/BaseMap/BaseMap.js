import React, { useState, useEffect, useRef } from "react";
import PaintBrush from "./components/PaintBrush";
import { useSelector, useDispatch } from "react-redux";
import { listenToSlidersEvents } from "../../../redux/actions";
import {
    _proccessAccessData,
    _proccessGridData,
    _postMapEditsToCityIO,
} from "./utils/BaseMapUtils";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import settings from "../../../settings/settings.json";
import AnimationComponent from "./components/AnimationComponent";
import { updateSunDirection, _setupSunEffects } from "./utils/EffectsUtils";
import {
    AccessLayer,
    AggregatedTripsLayer,
    ABMLayer,
    GridLayer,
} from "./layers";

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
    const [ABM, setABM] = useState({});
    const [loaded, setLoaded] = useState(false);
    const effectsRef = useRef();
    const deckGL = useRef();

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
        _setupSunEffects(effectsRef);
        // zoom map on CS table location
        _setViewStateToTableHeader();
        setLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loaded) return;
        updateSunDirection(sliders.time[1], effectsRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sliders.time]);

    useEffect(() => {
        if (!loaded) return;
        let shadowColor = shadowsOn ? [0, 0, 0, 0.5] : [0, 0, 0, 0];
        effectsRef.current[0].shadowColor = shadowColor;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shadowsOn]);

    useEffect(() => {
        setGEOGRID(_proccessGridData(cityioData));

        if (cityioData.access) {
            setAccess(_proccessAccessData(cityioData));
        }

        if (cityioData.ABM2) {
            setABM(cityioData.ABM2);
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

    // /**
    //  * Description. fix deck issue
    //  * with rotate right botton
    //  */
    const _rightClickViewRotate = () => {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", (evt) => evt.preventDefault());
    };

    const layersKey = {
        ABM: ABMLayer({
            data: ABM.trips,
            cityioData,
            ABMmode,
            zoomLevel: viewState.zoom,
            sliders,
        }),
        AGGREGATED_TRIPS: AggregatedTripsLayer({
            data: ABM.trips,
            cityioData,
            ABMmode,
        }),
        GRID: GridLayer({
            data: GEOGRID,
            editOn: menu.includes("EDIT"),
            state: {
                selectedType,
                keyDownState,
                selectedCellsState,
                pickingRadius,
            },
            updaters: {
                setSelectedCellsState,
                setDraggingWhileEditing,
                setHoveredObj,
            },
            deckGL,
        }),
        ACCESS: AccessLayer({
            data: access,
            accessToggle,
        }),
    };

    const layerOrder = ["ABM", "AGGREGATED_TRIPS", "GRID", "ACCESS"];

    const _renderLayers = () => {
        let layers = [];
        for (var layer of layerOrder) {
            if (menu.includes(layer)) {
                layers.push(layersKey[layer]);
            }
        }
        return layers;
    };

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
            <PaintBrush
                editOn={editOn}
                mousePos={mousePos}
                selectedType={selectedType}
                pickingRadius={pickingRadius}
                mouseDown={mouseDown}
                hoveredObj={hoveredObj}
            />
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
                effects={effectsRef.current}
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
