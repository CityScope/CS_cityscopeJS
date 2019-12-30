/* global window */
import React, { Component } from "react";
import { _proccessAccessData, _proccessGridData } from "./mapUtils";
import MapStats from "./MapStats/MapStats";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { TripsLayer } from "@deck.gl/geo-layers";
import "mapbox-gl/dist/mapbox-gl.css";
import { HeatmapLayer, PathLayer, GeoJsonLayer } from "deck.gl";
import { LightingEffect, AmbientLight, _SunLight } from "@deck.gl/core";
import settings from "../../settings/settings.json";

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStats: false,
            menu: null,
            cityioData: null,
            isDragging: false,
            selectedCellsState: null,
            time: 0,
            viewState: settings.map.initialViewState
        };
        this.animationFrame = null;
        this._onViewStateChange = this._onViewStateChange.bind(this);
    }

    _onViewStateChange({ viewState }) {
        this.setState({ viewState });
    }

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
            intensity: 1
        });
        const dirLight = new _SunLight({
            timestamp: Date.UTC(2019, 7, 1, 12),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true
        });
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.3];
        this._effects = [lightingEffect];
    }

    _animate() {
        // stop animation on state
        // if (this.animationFrame) {
        //     window.cancelAnimationFrame(this.animationFrame);
        // }
        const {
            startSimHour,
            animationSpeed,
            endSimHour
        } = settings.map.layers.ABM;
        let t = this.state.time + animationSpeed;
        if (this.state.time > endSimHour || this.state.time < startSimHour) {
            t = startSimHour;
        }
        this.setState({ time: t });
        this.animationFrame = window.requestAnimationFrame(
            this._animate.bind(this)
        );
    }

    /**
     * Description. calculates the sun position
     * to fit the `_animate` time
     */
    _calculateSunPosition() {
        const { startSimHour } = settings.map.layers.ABM;
        var date = new Date((startSimHour + this.state.time) * 1000);
        if (this._effects) {
            this._effects[0].directionalLights[0].timestamp = Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDay(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            );
        }
        return date.getHours().toString() + ":" + date.getMinutes().toString();
    }

    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        this._rightClickViewRotate();
        this._setupEffects();
        this._setViewStateToTableHeader();
        this._animate();
    }

    /**
     * handels events as they derived from redux props
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.menu !== prevState.menu) {
            this.setState({ menu: this.props.menu });
            //
            const menu = this.props.menu;
            menu.includes("ABM") || menu.includes("GRID")
                ? this.setState({ showStats: true })
                : this.setState({ showStats: false });
        }

        if (prevState.cityioData !== this.props.cityioData) {
            console.log("...new map data");

            const data = this.props.cityioData;
            this.setState({ cityioData: data });
            const gridData = _proccessGridData(data);
            this.setState({
                meta_grid: gridData
            });
            const accessData = _proccessAccessData(data);
            this.setState({ access: accessData });

            // FOR NOW FAKE TYPE
            this._rndType();
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
        const dim = 10;
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
    _handleSelection = e => {
        let rndType = this.state.randomType;
        const multiSelectedObj = this._mulipleObjPicked(e);
        multiSelectedObj.forEach(selected => {
            const thisCellProps = selected.object.properties;
            if (
                thisCellProps.land_use !== "None" &&
                !thisCellProps.interactive
            ) {
                thisCellProps.old_height = thisCellProps.height;
                thisCellProps.old_color = thisCellProps.color;
                thisCellProps.color = rndType.color;
                thisCellProps.height = rndType.height;
            }
        });

        this.setState({
            selectedCellsState: multiSelectedObj
        });
    };

    _renderLayers() {
        const cityioData = this.props.cityioData;

        let layers = [
            new GeoJsonLayer({
                id: "GRID",
                data: this.state.meta_grid,
                visible: this.props.menu.includes("GRID") ? true : false,
                pickable: true,
                extruded: true,
                lineWidthScale: 1,
                lineWidthMinPixels: 2,
                getElevation: d =>
                    d.properties.land_use !== "None" ? d.properties.height : 0,
                getFillColor: d =>
                    d.properties.type !== undefined
                        ? d.properties.color
                        : d.properties.color
                        ? d.properties.color
                        : d.properties.land_use !== "None"
                        ? settings.map.types.white.color
                        : settings.map.types.water.color,

                onDrag: event => {
                    if (this.props.menu.includes("EDIT"))
                        this._handleSelection(event);
                },
                onDragStart: () => {
                    if (this.props.menu.includes("EDIT")) {
                        this.setState({ isDragging: true });
                    }
                },
                onHover: e => {
                    if (e.object && e.object.properties) {
                        this.setState({
                            gridCellInfo: e.object.properties
                        });
                    }
                },
                onDragEnd: () => {
                    this.setState({ isDragging: false });
                },

                updateTriggers: {
                    getFillColor: this.state.selectedCellsState,
                    getElevation: this.state.selectedCellsState
                },
                transitions: {
                    getFillColor: 500,

                    getElevation: 500
                }
            }),

            new TripsLayer({
                id: "ABM",
                visible: this.props.menu.includes("ABM") ? true : false,
                data: cityioData.ABM,
                // getPath: d => d.path,
                getPath: d => {
                    for (let i in d.path) {
                        d.path[i][2] = 20;
                    }
                    return d.path;
                },

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
                getWidth: 2,
                opacity: 0.8,
                rounded: true,
                trailLength: 500,
                currentTime: this.state.time
            }),

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
                        d.path[i][2] = 200;
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
            }),

            new HeatmapLayer({
                id: "ACCESS",
                visible: this.props.menu.includes("ACCESS") ? true : false,
                colorRange: settings.map.layers.heatmap.colors,
                radiusPixels: 200,
                opacity: 0.25,
                data: this.state.access,
                getPosition: d => d.coordinates,
                getWeight: d => d.values.housing
            })
        ];
        return layers;
    }

    _onWebGLInitialized = gl => {
        this.setState({ gl });
    };

    /**
     * Description.
     * Temp def. for color selection
     */
    _rndType = () => {
        var keys = Object.keys(settings.map.types);
        let randomType =
            settings.map.types[keys[(keys.length * Math.random()) << 0]];
        this.setState({ randomType: randomType });
    };

    _statsUI = () => {
        const menu = this.props.menu;
        if (menu.includes("ABM")) {
            return <MapStats stats={this._calculateSunPosition()} />;
        } else if (menu.includes("GRID") && this.state.gridCellInfo) {
            // {"height":10,"interactive":false,"interactive_id":null,"land_use":"M1"}
            const stats =
                "Height: " +
                this.state.gridCellInfo.height +
                " Land Use: " +
                this.state.gridCellInfo.land_use;
            return <MapStats stats={stats} />;
        }
    };

    /**
     * Description.
     * draw target area around mouse
     */
    _renderSelectionTarget = () => {
        if (this.props.menu.includes("EDIT")) {
            const rt = this.state.randomType;
            const color =
                "rgb(" +
                rt.color[0] +
                "," +
                rt.color[1] +
                "," +
                rt.color[2] +
                ")";
            const mousePos = this.state.mousePos;
            const divSize = 30;
            return (
                <div
                    style={{
                        border: "2px solid",
                        borderColor: color,
                        borderRadius: "15%",
                        position: "fixed",
                        zIndex: 1,
                        pointerEvents: "none",
                        width: divSize,
                        height: divSize,
                        left: mousePos.clientX - divSize / 2,
                        top: mousePos.clientY - divSize / 2
                    }}
                ></div>
            );
        }
    };

    render() {
        return (
            <div
                onMouseMove={e =>
                    this.setState({
                        mousePos: e.nativeEvent
                    })
                }
            >
                <div>{this._renderSelectionTarget()}</div>
                <div>{this.state.showStats ? this._statsUI() : null}</div>

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
                        dragPan: !this.state.isDragging,
                        dragRotate: !this.state.isDragging
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

export default Map;
