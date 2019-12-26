/* global window */
import React, { Component } from "react";
import {
    _proccessAccessData,
    _proccessGridData,
    _renderSelectionTarget
} from "./mapUtils";
import { connect } from "react-redux";
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
            cityioData: {},
            isDragging: false,
            selectedCellsState: null,
            toggleBuildingShow: "none",
            time: 0,
            viewState: settings.map.initialViewState
        };
        this.animationFrame = null;
        this._onViewStateChange = this._onViewStateChange.bind(this);
    }

    _onViewStateChange({ viewState }) {
        this.setState({ viewState });
    }

    _handleKeyDown = e => {
        // shift == 16
        this.setState({ keyDownState: e.nativeEvent.keyCode });

        // compute rnd color for now
        if (e.nativeEvent.keyCode === 16) {
            this.setState({
                mapStyle: null
            });
            // TEMP
            this._rndType();
        }
    };

    _handleKeyUp = () => {
        this.setState({ keyDownState: null });
    };

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
            timestamp: Date.UTC(2019, 7, 1, 10),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true
        });
        this.day = Date.UTC(2019, 7, 1, this.state.time);
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.3];
        this._effects = [lightingEffect];
    }

    _animate() {
        // stop animation on state
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        } else {
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
            this.setState({
                time: t
            });
            this.animationFrame = window.requestAnimationFrame(
                this._animate.bind(this)
            );
            this._calculateSunPosition();
        }
    }

    /**
     * Description. calculates the sun position
     * to fit the `_animate` time
     */
    _calculateSunPosition() {
        var date = new Date(this.state.time * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        if (this._effects)
            this._effects[0].directionalLights[0].timestamp = Date.UTC(
                2019,
                7,
                1,
                hours,
                minutes,
                seconds
            );
    }

    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        // this._animate();
        this._rightClickViewRotate();
        this._setupEffects();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.cityioData !== this.state.cityioData) {
            if ("grid" in this.props.cityioData) {
                const data = this.props.cityioData;
                this.setState({ cityioData: data });
                const gridData = _proccessGridData(data);
                this.setState({
                    meta_grid: gridData
                });
                const accessData = _proccessAccessData(data);
                this.setState({
                    accessColors: accessData.colors
                });
                this.setState({ access: accessData.heatmap });

                this._setViewStateToTableHeader();
            }
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
     * Description.
     * Temp def. for color selection
     */
    _rndType = () => {
        var keys = Object.keys(settings.map.types);
        let randomType =
            settings.map.types[keys[(keys.length * Math.random()) << 0]];
        this.setState({ randomType: randomType });
    };

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
            if (thisCellProps.land_use === "M1" && !thisCellProps.interactive) {
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

    /**
     * Description.
     * control state of deckgl `drag`
     */
    _handleDrag = bool => {
        this.setState({ isDragging: bool });
    };

    _renderLayers() {
        const cityioData = this.props.cityioData;

        let layers = [
            new GeoJsonLayer({
                id: "GRID",
                data: this.state.meta_grid,
                visible: true,
                pickable: true,
                extruded: true,
                lineWidthScale: 1,
                lineWidthMinPixels: 2,
                getElevation: d =>
                    d.properties.land_use === "M1" ? d.properties.height : 0,
                getFillColor: d =>
                    d.properties.type !== undefined
                        ? d.properties.color
                        : d.properties.color
                        ? d.properties.color
                        : d.properties.land_use === "M1"
                        ? settings.map.types.white.color
                        : settings.map.types.water.color,

                onDrag: event => {
                    if (this.state.keyDownState === 16)
                        this._handleSelection(event);
                },
                onDragStart: () => {
                    if (this.state.keyDownState === 16) {
                        this._handleDrag(true);
                    }
                },
                onDragEnd: () => {
                    this._handleDrag(false);
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
                visible: false,
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
                getWidth: 2,
                opacity: 0.8,
                rounded: true,
                trailLength: 200,
                currentTime: this.state.time
            }),

            new PathLayer({
                id: "PATHS",
                visible: false,
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
                visible: false,
                colorRange: this.state.accessColors,
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

    render() {
        return (
            <div
                onKeyDown={this._handleKeyDown}
                onKeyUp={this._handleKeyUp}
                onMouseMove={e =>
                    this.setState({
                        mousePos: e.nativeEvent
                    })
                }
            >
                <div>{_renderSelectionTarget(this.state.keyDownState)}</div>

                <DeckGL
                    // sets the cursor on paint
                    getCursor={() =>
                        this.state.keyDownState === 16 ? "none" : "all-scroll"
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

const mapStateToProps = reduxState => {
    return {
        cityioData: reduxState
    };
};

export default connect(mapStateToProps, null)(Map);
