/* global window */
import React, { Component } from "react";
import { CellMeta, SelectionTarget } from "./baseMapComponents";

import { connect } from "react-redux";
import { listenToMapEvents } from "../../redux/actions";
import {
    _proccesNetworkPnts,
    _proccessAccessData,
    _proccessGridData,
    _postMapEditsToCityIO,
    _proccessGridTextData,
    _proccessBresenhamGrid,
    setDirLightSettings,
    _bresenhamLine
} from "./baseMapUtils";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { TripsLayer } from "@deck.gl/geo-layers";
import "mapbox-gl/dist/mapbox-gl.css";
import {
    HeatmapLayer,
    PathLayer,
    GeoJsonLayer,
    TextLayer,
    ScatterplotLayer
} from "deck.gl";
import { LightingEffect, AmbientLight, _SunLight } from "@deck.gl/core";
import settings from "../../settings/settings.json";
import { newDataStyle } from "../../services/consoleStyle";
class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: null,
            cityioData: null,
            selectedType: null,
            draggingWhileEditing: false,
            selectedCellsState: null,
            selectedNetState: null,
            time: 0,
            pickingRadius: 40,
            viewState: settings.map.initialViewState,
            networkFirstPoint: null,
            networkEdge: [],
            networkLayer: []
        };
        this.animationFrame = null;
        this.timeZoneOffset = setDirLightSettings(
            this.props.cityioData.GEOGRID.properties.header
        );
        this.dirLightSettings = {
            timestamp: Date.UTC(2019, 7, 1, 11 + this.timeZoneOffset),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true
        };
    }

    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        const cityIOdata = this.props.cityioData;
        // fix deck view rotate
        this._rightClickViewRotate();
        // setup sun effects
        this._setupEffects();
        // zoom map on CS table location
        this._setViewStateToTableHeader();
        this.setState({
            networkPnts: _proccesNetworkPnts(cityIOdata),
            gridTextData: _proccessGridTextData(cityIOdata),
            bresenhamGrid: _proccessBresenhamGrid(cityIOdata),
            networkLayer: cityIOdata.GEONETWORK
        });
    }

    /**
     * handels events as they derived from redux props
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.menu !== prevState.menu) {
            this.setState({ menu: this.props.menu });
            // start ainmation/sim/roate
            this._animate();
        }

        if (prevState.cityioData !== this.props.cityioData) {
            console.log("%c new cityioData to render ", newDataStyle);
            // get cityio data from props
            const cityioData = this.props.cityioData;
            this.setState({
                cityioData: cityioData,
                GEOGRID: _proccessGridData(cityioData)
            });

            // ! workaround for preloading access layer data
            if (this.props.cityioData.access) {
                this.setState({ access: _proccessAccessData(cityioData) });
            }
        }

        //  toggle edit mode and send to cityio
        if (
            prevProps.menu.includes("EDIT") &&
            !this.props.menu.includes("EDIT")
        ) {
            // take props from grid and send
            let dataProps = [];
            for (let i = 0; i < this.state.GEOGRID.features.length; i++) {
                dataProps[i] = this.state.GEOGRID.features[i].properties;
            }
            _postMapEditsToCityIO(
                dataProps,
                this.props.cityioData.tableName,
                "/GEOGRIDDATA"
            );

            _postMapEditsToCityIO(
                this.state.networkLayer,
                this.props.cityioData.tableName,
                "/GEONETWORK"
            );
        }

        // toggle reset view mode
        if (
            !prevProps.menu.includes("RESET_VIEW") &&
            this.props.menu.includes("RESET_VIEW")
        ) {
            this._setViewStateToTableHeader();
        } else if (
            prevProps.menu.includes("RESET_VIEW") &&
            !this.props.menu.includes("RESET_VIEW")
        ) {
            this.setState({
                viewState: {
                    ...this.state.viewState,
                    pitch: 45
                }
            });
        }
    }

    _onViewStateChange = ({ viewState }) => {
        viewState.orthographic = this.props.menu.includes("RESET_VIEW")
            ? true
            : false;

        this.setState({ viewState });
    };

    /**
     * resets the camera viewport
     * to cityIO header data
     * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
     */
    _setViewStateToTableHeader() {
        const header = this.props.cityioData.GEOGRID.properties.header;

        this.setState({
            viewState: {
                ...this.state.viewState,
                longitude: header.longitude,
                latitude: header.latitude,
                zoom: 15,
                pitch: 0,
                bearing: 360 - header.rotation,
                orthographic: true
            }
        });
    }

    _setupEffects() {
        const ambientLight = new AmbientLight({
            color: [255, 255, 255],
            intensity: 0.85
        });
        const dirLight = new _SunLight(this.dirLightSettings);
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.5];
        this._effects = [lightingEffect];
    }

    _animate() {
        /**
         * remove the binded animation when comp updates
         */
        window.cancelAnimationFrame(this.animationFrame);

        if (this.props.menu.includes("ABM")) {
            const {
                startSimHour,
                animationSpeed,
                endSimHour
            } = settings.map.layers.ABM;

            let t = this.state.time + animationSpeed;
            if (
                this.state.time > endSimHour ||
                this.state.time < startSimHour
            ) {
                t = startSimHour;
            }

            let offset = this.timeZoneOffset * 3600;
            var date = new Date(
                (startSimHour + offset + this.state.time) * 1000
            );
            this._effects[0].directionalLights[0].timestamp = Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDay(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            );

            this.setState({ time: t });
        }
        if (this.props.menu.includes("ROTATE")) {
            let bearing = this.state.viewState.bearing
                ? this.state.viewState.bearing
                : 0;
            bearing < 360 ? (bearing += 0.05) : (bearing = 0);

            this.setState({
                viewState: {
                    ...this.state.viewState,
                    bearing: bearing
                }
            });
        }

        this.animationFrame = window.requestAnimationFrame(
            this._animate.bind(this)
        );

        // stop animation on state
        if (!this.props.menu.includes("ABM")) {
            // && this.animationFrame
            this._effects[0].directionalLights[0].timestamp = this.dirLightSettings.timestamp;
            return;
        }
    }

    /**
     * Description. fix deck issue
     * with rotate right botton
     */
    _rightClickViewRotate() {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", evt => evt.preventDefault());
    }

    /**
     * Description. uses deck api to
     * collect objects in a region
     * @argument{object} e  picking event
     */
    _mulipleObjPicked = e => {
        const dim = this.state.pickingRadius;
        const x = e.x - dim / 2;
        const y = e.y - dim / 2;
        let mulipleObj = this.deckGL.pickObjects({
            x: x,
            y: y,
            width: dim,
            height: dim
        });
        return mulipleObj;
    };

    /**
     * Description. allow only to pick cells that are
     *  not of CityScope TUI & that are interactable
     * so to not overlap TUI activity
     */
    _handleGridcellEditing = e => {
        const { selectedType } = this.props;
        const { height, color, name } = selectedType;
        const multiSelectedObj = this._mulipleObjPicked(e);
        multiSelectedObj.forEach(selected => {
            const thisCellProps = selected.object.properties;
            if (
                this.props.selectedType.class === "buildingsClass" &&
                thisCellProps.land_use !== "None"
            ) {
                thisCellProps.old_height = thisCellProps.height;
                thisCellProps.old_color = thisCellProps.color;
                thisCellProps.color = color;
                thisCellProps.height = height;
                thisCellProps.name = name;
            }
        });
        this.setState({
            selectedCellsState: multiSelectedObj
        });
    };

    _handleNetworkHover = pnt => {
        // paint the pnt
        const { selectedType } = this.props;
        // check if really a pnt
        if (
            pnt &&
            pnt.object &&
            pnt.object.properties &&
            selectedType.name !== "Clear network"
        ) {
            const pntProps = pnt.object.properties;
            pntProps.old_color = pntProps.color;
            pntProps.color = selectedType.color;
            pntProps.old_netWidth = pntProps.netWidth;
            pntProps.netWidth = pntProps.netWidth * 2;
            // dirty solution for animating selection
            this.setState({
                hoveredPnt: pnt.object
            });

            // then back to org color
            pntProps.color = pntProps.old_color;
            pntProps.netWidth = pntProps.old_netWidth;

            this.setState({
                hoveredPnt: pnt.object
            });
        }
    };

    _handleNetworkRemove = path => {
        const selectedType = this.props.selectedType;
        if (path.object && selectedType.name === "Delete Path") {
            path = path.object;
            this.state.networkLayer.forEach((item, index, object) => {
                if (item.id === path.id) {
                    object.splice(index, 1);
                    let tmpObj = JSON.parse(JSON.stringify(object));
                    this.setState({
                        networkLayer: tmpObj
                    });
                }
            });
        }
    };

    /**
     *
     * if we have the first pnt
     * get the second point
     * if on any of it's 4 immidate sides
     * draw line
     *
     */
    _handleNetworkCreate = pnt => {
        // check if on network path  delete mode
        const selectedType = this.props.selectedType;
        // if we're not removing paths
        if (selectedType.name !== "Delete Path") {
            // if this is the first point
            if (!this.state.networkFirstPoint) {
                // make this the first point
                this.setState({ networkFirstPoint: pnt });
            } else {
                const pickData = this.deckGL.pickObject({
                    x: pnt.x,
                    y: pnt.y
                });

                if (
                    pickData &&
                    selectedType.class === "networkClass" &&
                    selectedType.name !== "Clear network"
                ) {
                    const FP = this.state.networkFirstPoint.object.properties
                        .gridPosition;
                    const SP = pickData.object.properties.gridPosition;

                    let lineObj = _bresenhamLine(
                        FP[0],
                        FP[1],
                        SP[0],
                        SP[1],
                        this.state.bresenhamGrid
                    );

                    let tmpArr;

                    tmpArr = Array.isArray(this.state.networkLayer)
                        ? this.state.networkLayer
                        : [];

                    let bresenhamLine = {
                        path: lineObj,
                        id: tmpArr.length,
                        selectedType: this.props.selectedType
                    };

                    tmpArr.push(bresenhamLine);
                    tmpArr = JSON.parse(JSON.stringify(tmpArr));
                    this.setState({ networkLayer: tmpArr });
                    // null the first pnt for new selection
                    this.setState({ networkFirstPoint: null });
                }
            }
        }
    };

    /**
     * Description.
     * draw target area around mouse
     */
    _renderSelectionTarget = () => {
        if (this.props.menu.includes("EDIT")) {
            return (
                this.props.selectedType && (
                    <SelectionTarget
                        mousePos={this.state.mousePos}
                        selectedType={this.props.selectedType}
                        divSize={this.state.pickingRadius}
                        mouseDown={this.state.mouseDown}
                    />
                )
            );
        } else {
            return (
                this.state.hoveredObj && (
                    <CellMeta
                        mousePos={this.state.mousePos}
                        hoveredObj={this.state.hoveredObj}
                    />
                )
            );
        }
    };

    _handleKeyUp = () => {
        this.setState({ keyDownState: null });
    };

    _handleKeyDown = e => {
        // avoid common clicks
        this.setState({ keyDownState: e.nativeEvent.key });
        if (e.nativeEvent.key === "=" && this.state.pickingRadius < 100) {
            this.setState({ pickingRadius: this.state.pickingRadius + 5 });
        } else if (e.nativeEvent.key === "-" && this.state.pickingRadius > 0) {
            this.setState({ pickingRadius: this.state.pickingRadius - 5 });
        }
    };

    /**
     * remap line width
     */
    _remapValues = value => {
        let remap =
            value > 14 && value < 20 ? 5 : value < 14 && value > 12 ? 20 : 40;
        return remap;
    };

    /**
     * renders deck gl layers
     */
    _renderLayers() {
        const zoomLevel = this.state.viewState.zoom;
        const cityioData = this.props.cityioData;

        let layers = [];

        if (this.props.menu.includes("TEXT")) {
            layers.push(
                new TextLayer({
                    id: "gridText-layer",
                    data: this.state.gridTextData,
                    getText: d => d.text,
                    getPosition: d => d.coordinates,
                    getColor: [255, 255, 255],
                    getSize: 10
                })
            );
        }

        if (this.props.menu.includes("GRID")) {
            layers.push(
                new GeoJsonLayer({
                    id: "GRID",
                    // loads geogrid into visualization
                    data: this.state.GEOGRID,
                    visible: this.props.menu.includes("GRID") ? true : false,
                    pickable:
                        this.props.selectedType.class === "networkClass"
                            ? false
                            : true,
                    extruded: true,
                    lineWidthScale: 1,
                    lineWidthMinPixels: 2,
                    getElevation: d =>
                        d.properties.height &&
                        d.properties.height.constructor === Array
                            ? d.properties.height[1]
                            : d.properties.height,
                    getFillColor: d => d.properties.color,
                    onClick: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift" &&
                            this.props.selectedType.class === "buildingsClass"
                        )
                            this._handleGridcellEditing(event);
                    },
                    onHover: e => {
                        if (e.object) {
                            this.setState({ hoveredObj: e });
                        }
                    },

                    onDrag: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        )
                            this._handleGridcellEditing(event);
                    },
                    onDragStart: () => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        ) {
                            this.setState({ draggingWhileEditing: true });
                        }
                    },
                    onDragEnd: () => {
                        this.setState({ draggingWhileEditing: false });
                    },
                    updateTriggers: {
                        getFillColor: this.state.selectedCellsState,
                        getElevation: this.state.selectedCellsState
                    },
                    transitions: {
                        getFillColor: 500,
                        getElevation: 500
                    }
                })
            );
        }

        if (
            this.props.menu.includes("NETWORK") &&
            this.state.networkPnts &&
            this.state.networkPnts.features
        ) {
            if (this.props.menu.includes("EDIT")) {
                layers.push(
                    new ScatterplotLayer({
                        id: "NETWORK",
                        data: this.state.networkPnts.features,
                        pickable: true,
                        opacity: 1,
                        filled: true,
                        radiusScale: 1,
                        radiusMinPixels: 1,
                        radiusMaxPixels: 100,
                        getPosition: d => d.geometry.coordinates,
                        getFillColor: d => d.properties.color,
                        getRadius: d => d.properties.netWidth,

                        onHover: e => {
                            if (
                                this.props.menu.includes("EDIT") &&
                                this.state.keyDownState !== "Shift"
                            ) {
                                this._handleNetworkHover(e);
                            }
                        },
                        onClick: e => {
                            if (
                                this.props.menu.includes("EDIT") &&
                                this.state.keyDownState !== "Shift"
                            ) {
                                this._handleNetworkCreate(e);
                            }
                        },

                        updateTriggers: {
                            getFillColor: this.state.hoveredPnt,
                            getRadius: this.state.hoveredPnt
                        },
                        transitions: {
                            getFillColor: 100,
                            getRadius: 300
                        }
                    })
                );
            }

            layers.push(
                new PathLayer({
                    pickable: true,
                    id: "NETWORK_PATHS",
                    data: this.state.networkLayer,
                    widthScale: 1,
                    widthMinPixels: 5,
                    getPath: d => d.path,
                    getColor: d => d.selectedType.color,
                    getWidth: d => d.selectedType.width,
                    onClick: e => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        ) {
                            this._handleNetworkRemove(e);
                        }
                    },
                    updateTriggers: {
                        getPath: this.state.networkLayer
                    },
                    transitions: {
                        getPath: 500
                    }
                })
            );
        }

        if (this.props.menu.includes("ACCESS")) {
            layers.push(
                new HeatmapLayer({
                    id: "ACCESS",
                    visible: this.props.menu.includes("ACCESS") ? true : false,
                    colorRange: settings.map.layers.heatmap.colors,
                    radiusPixels: 200,
                    opacity: 0.25,
                    data: this.state.access,
                    getPosition: d => d.coordinates,
                    getWeight: d => {
                        return d.values[Object.keys(d.values)[0]];
                    }
                })
            );
        }

        if (this.props.menu.includes("ABM")) {
            layers.push(
                new TripsLayer({
                    id: "ABM",
                    visible: this.props.menu.includes("ABM") ? true : false,
                    data: cityioData.ABM,
                    getPath: d => d.path,
                    getTimestamps: d => d.timestamps,
                    getColor: d => {
                        //switch between modes or types of users
                        switch (d.mode[1]) {
                            case 0:
                                return [255, 0, 0];
                            case 1:
                                return [0, 0, 255];
                            case 2:
                                return [0, 255, 0];
                            default:
                                return [0, 0, 0];
                        }
                    },
                    getWidth: 1,
                    widthScale: this._remapValues(zoomLevel),
                    opacity: 0.8,
                    rounded: true,
                    trailLength: 500,
                    currentTime: this.state.time
                })
            );
        }

        if (this.props.menu.includes("PATHS")) {
            layers.push(
                new PathLayer({
                    id: "PATHS",
                    visible: this.props.menu.includes("PATHS") ? true : false,
                    _shadow: false,
                    data: cityioData.ABM,
                    getPath: d => {
                        const noisePath =
                            Math.random() < 0.5
                                ? Math.random() * 0.00005
                                : Math.random() * -0.00005;
                        for (let i in d.path) {
                            d.path[i][0] = d.path[i][0] + noisePath;
                            d.path[i][1] = d.path[i][1] + noisePath;
                            d.path[i][2] = 10;
                        }
                        return d.path;
                    },
                    getColor: d => {
                        switch (d.mode[1]) {
                            case 0:
                                return [255, 0, 0];
                            case 1:
                                return [0, 0, 255];
                            case 2:
                                return [0, 255, 0];
                            default:
                                return [0, 0, 0];
                        }
                    },
                    opacity: 0.2,
                    getWidth: 1
                })
            );
        }
        return layers;
    }

    render() {
        return (
            <div
                className="baseMap"
                onKeyDown={this._handleKeyDown}
                onKeyUp={this._handleKeyUp}
                onMouseMove={e =>
                    this.setState({
                        mousePos: e.nativeEvent
                    })
                }
                onMouseUp={() =>
                    this.setState({
                        mouseDown: false
                    })
                }
                onMouseDown={() =>
                    this.setState({
                        mouseDown: true
                    })
                }
            >
                {/* renders the slection box div */}
                <div>{this._renderSelectionTarget()}</div>

                <DeckGL
                    // sets the cursor on paint
                    getCursor={() =>
                        this.props.menu.includes("EDIT") ? "none" : "all-scroll"
                    }
                    ref={ref => {
                        // save a reference to the Deck instance
                        this.deckGL = ref && ref.deck;
                    }}
                    viewState={this.state.viewState}
                    onViewStateChange={this._onViewStateChange}
                    layers={this._renderLayers()}
                    effects={this._effects}
                    controller={{
                        touchZoom: true,
                        touchRotate: true,
                        dragPan: !this.state.draggingWhileEditing,
                        dragRotate: !this.state.draggingWhileEditing,
                        keyboard: false
                    }}
                >
                    <StaticMap
                        asyncRender={true}
                        dragRotate={true}
                        reuseMaps={true}
                        mapboxApiAccessToken={
                            process.env.REACT_APP_MAPBOX_TOKEN
                        }
                        mapStyle={settings.map.mapStyle.blue}
                        preventStyleDiffing={true}
                    />
                </DeckGL>
            </div>
        );
    }
}

const mapDispatchToProps = {
    listenToMapEvents: listenToMapEvents
};

export default connect(null, mapDispatchToProps)(Map);
