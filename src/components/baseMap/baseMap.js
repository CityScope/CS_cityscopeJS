/* global window */
import React, { Component } from "react";
import { connect } from "react-redux";
import { listenToMapEvents } from "../../redux/actions";
import {
    _proccesnetworkGeojson,
    _proccessAccessData,
    _proccessGridData,
    _postMapEditsToCityIO,
    _proccessGridTextData,
    setDirLightSettings
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
import { consoleStyle } from "../../services/consoleStyle";
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
            viewState: settings.map.initialViewState
        };
        this.animationFrame = null;
        this._onViewStateChange = this._onViewStateChange.bind(this);
        this.timeZoneOffset = setDirLightSettings(this.props.cityioData.header);
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
        // fix deck view rotate
        this._rightClickViewRotate();
        // setup sun effects
        this._setupEffects();
        // zoom map on CS table location
        this._setViewStateToTableHeader();
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
            console.log("%c new cityioData data to render ", consoleStyle);
            // get cityio data from props
            const cityioData = this.props.cityioData;
            this.setState({
                cityioData: cityioData,
                meta_grid: _proccessGridData(cityioData),
                gridTextData: _proccessGridTextData(cityioData),
                networkGeojson: _proccesnetworkGeojson(cityioData)
            });

            // ! workaround for preloading access layer data
            if (this.props.cityioData.access) {
                this.setState({ access: _proccessAccessData(cityioData) });
            }
        }

        //    toggle edit mode
        if (
            prevProps.menu.includes("EDIT") &&
            !this.props.menu.includes("EDIT")
        ) {
            _postMapEditsToCityIO(
                this.state.meta_grid,
                this.props.cityioData.tableName,
                "/interactive_grid_data"
            );

            _postMapEditsToCityIO(
                this.state.networkGeojson,
                this.props.cityioData.tableName,
                "/interactive_network_data"
            );
        }

        //    toggle reset view mode
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

    _onViewStateChange({ viewState }) {
        this.setState({ viewState });
    }

    /**
     * resets the camera viewport
     * to cityIO header data
     * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
     */
    _setViewStateToTableHeader() {
        const header = this.props.cityioData.header;
        this.setState({
            viewState: {
                ...this.state.viewState,
                longitude: header.spatial.longitude,
                latitude: header.spatial.latitude,
                zoom: 14,
                pitch: 0,
                bearing: 180 - header.spatial.rotation
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

    _handleCellsHover = e => {
        const selectedType = this.props.selectedType;

        if (e.object && e.object.properties) {
            const thisCellProps = e.object.properties;
            if (
                thisCellProps.land_use !== "None" &&
                !thisCellProps.interactive
            ) {
                thisCellProps.old_color = thisCellProps.color;
                thisCellProps.color = selectedType.color;
                this.setState({
                    selectedCellsState: e.object
                });
                thisCellProps.color = thisCellProps.old_color;
                this.setState({
                    selectedCellsState: e.object
                });
            }
        }
    };

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
        const selectedType = this.props.selectedType;
        const multiSelectedObj = this._mulipleObjPicked(e);
        multiSelectedObj.forEach(selected => {
            const thisCellProps = selected.object.properties;
            if (
                this.props.selectedType.class === "buildingsClass" &&
                thisCellProps.land_use !== "None" &&
                !thisCellProps.interactive
            ) {
                thisCellProps.old_height = thisCellProps.height;
                thisCellProps.old_color = thisCellProps.color;
                thisCellProps.color = selectedType.color;
                thisCellProps.height = selectedType.height;
            }
        });
        this.setState({
            selectedCellsState: multiSelectedObj
        });
    };

    /**
     * Description. allow only to pick net edges
     */
    _handleNetworkEditing = e => {
        const selectedType = this.props.selectedType;
        const multiEdgeSelected = this._mulipleObjPicked(e);
        multiEdgeSelected.forEach(edge => {
            const thisEdgeProps = edge.object.properties;
            // network edges selected
            if (
                this.props.selectedType.class === "networkClass" &&
                thisEdgeProps.land_use === "network"
            ) {
                thisEdgeProps.old_color = thisEdgeProps.color;
                thisEdgeProps.color = selectedType.color;
                thisEdgeProps.netWidth = selectedType.width;
            }
        });
        this.setState({
            selectedNetState: multiEdgeSelected
        });
    };

    /**
     * Description.
     * draw target area around mouse
     */
    _renderSelectionTarget = () => {
        if (this.props.menu.includes("EDIT") && this.state.mousePos) {
            const targetMetaData = this.props.selectedType;

            const rc = targetMetaData.color;
            const color = "rgb(" + rc[0] + "," + rc[1] + "," + rc[2] + ")";
            const mousePos = this.state.mousePos;
            const divSize = this.state.pickingRadius;

            let mouseX = mousePos.clientX - divSize / 2;
            let mouseY = mousePos.clientY - divSize / 2;

            return (
                <div
                    style={{
                        border: "2px solid",
                        backgroundColor: this.state.mouseDown
                            ? "rgba(" +
                              rc[0] +
                              "," +
                              rc[1] +
                              "," +
                              rc[2] +
                              ",0.6)"
                            : "rgba(0,0,0,0)",
                        borderColor: color,
                        color: color,
                        borderRadius: "15%",
                        position: "fixed",
                        zIndex: 1,
                        pointerEvents: "none",
                        width: divSize,
                        height: divSize,
                        left: mouseX,
                        top: mouseY
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            left: divSize + 10,
                            fontSize: "1vw"
                        }}
                    >
                        {targetMetaData.name}
                    </div>
                </div>
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
                    getSize: 16
                })
            );
        }

        if (
            this.props.menu.includes("NETWORK") &&
            this.state.networkGeojson &&
            this.state.networkGeojson.features
        ) {
            layers.push(
                new ScatterplotLayer({
                    id: "NETWORK",
                    data: this.state.networkGeojson.features,
                    pickable: true,
                    opacity: 0.8,
                    stroked: false,
                    filled: true,
                    radiusScale: 1,
                    radiusMinPixels: 1,
                    radiusMaxPixels: 20,
                    getPosition: d => d.geometry.coordinates,
                    getFillColor: d => d.properties.color,
                    getRadius: d => d.properties.netWidth,
                    updateTriggers: {
                        getFillColor: this.state.selectedNetState,
                        getRadius: this.state.selectedNetState
                    },
                    transitions: {
                        getFillColor: 500,
                        getRadius: 500
                    },
                    onClick: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        )
                            this._handleNetworkEditing(event);
                    },
                    onDrag: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        )
                            this._handleNetworkEditing(event);
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
                    }
                })
            );
        }

        if (this.props.menu.includes("GRID")) {
            layers.push(
                new GeoJsonLayer({
                    id: "GRID",
                    data: this.state.meta_grid,
                    visible: this.props.menu.includes("GRID") ? true : false,
                    pickable: true,
                    extruded: true,
                    lineWidthScale: 1,
                    lineWidthMinPixels: 2,
                    getElevation: d => d.properties.height,
                    getFillColor: d =>
                        d.properties.type !== undefined
                            ? d.properties.color
                            : d.properties.color
                            ? d.properties.color
                            : d.properties.land_use !== "None"
                            ? settings.map.types[1].color
                            : settings.map.types[0].color,
                    onClick: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        )
                            this._handleGridcellEditing(event);
                    },
                    onHover: event => {
                        if (
                            this.props.menu.includes("EDIT") &&
                            this.state.keyDownState !== "Shift"
                        )
                            this._handleCellsHover(event);
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
                    // ! get Z for each segment
                    // getPath: d => {
                    //     for (let i in d.path) {
                    //         d.path[i][2] = Math.random() * 20;
                    //     }
                    //     return d.path;
                    // },

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
