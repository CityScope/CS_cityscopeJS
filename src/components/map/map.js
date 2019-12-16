/* global window */
import React, { Component } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { TripsLayer } from "@deck.gl/geo-layers";
import "mapbox-gl/dist/mapbox-gl.css";

import { HeatmapLayer, PathLayer, GeoJsonLayer } from "deck.gl";
import {
    LightingEffect,
    AmbientLight,
    _SunLight as SunLight
} from "@deck.gl/core";

import { getCityIO } from "../../services/cityIO";

export default class Map extends Component {
    constructor(props) {
        super(props);
        //
        this.state = {
            cityIOheader: null,
            geoJsonData: null,
            time: 0,
            accessData: null,
            ABMdata: null,
            viewState: {
                longitude: -71.0894527,
                latitude: 42.3603609,
                zoom: 17,
                pitch: 0,
                bearing: 0
            }
        };
        //
        const ambientLight = new AmbientLight({
            color: [255, 255, 255],
            intensity: 1
        });
        //
        const dirLight = new SunLight({
            timestamp: Date.UTC(2019, 7, 1, 10),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true
        });
        //
        this.day = Date.UTC(2019, 7, 1, this.state.time);
        //
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.3];
        this._effects = [lightingEffect];
        //
        this.cityIObaseURL = "https://cityio.media.mit.edu/api/table/";
        //
        this.colors = {
            idle: [255, 255, 255, 200],
            picked: [77, 195, 255, 200],
            hovered: [255, 51, 204, 200],
            water: [100, 100, 100, 200]
        };
        //
        this.animationFrame = null;
        this.startSimHour = 60 * 60 * 7;
        this.endSimHour = 60 * 60 * 14;
        this.animationSpeed = 10;

        //
        this._onViewStateChange = this._onViewStateChange.bind(this);
    }

    _onViewStateChange({ viewState }) {
        this.setState({ viewState });
    }

    _animate() {
        // stop animation on toggle
        if (
            this.animationFrame &&
            !this.props.menu.includes("ABM") &&
            !this.props.menu.includes("SUN")
        ) {
            window.cancelAnimationFrame(this.animationFrame);
            return;
        }

        const { startSimHour, animationSpeed, endSimHour } = this;
        let t = this.state.time + animationSpeed;
        if (this.state.time > endSimHour || this.state.time < startSimHour) {
            t = startSimHour;
        }
        this.setState({
            time: t
        });
        this._animationFrame = window.requestAnimationFrame(
            this._animate.bind(this)
        );
        this._calculateSunPosition();
    }

    _calculateSunPosition() {
        const layersProps = this.props.menu;
        if (!layersProps.includes("SUN")) return;
        var date = new Date(this.state.time * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
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
        this._animate();

        // hack  to allow view rotatae
        this._rightClickViewRotate();
        //  get data
        this._getLayersData();
    }

    async _getLayersData() {
        let gridData = null;
        let interactiveGridMappingData = null;
        let geoJsonData = null;

        await getCityIO(this.cityIObaseURL + "grasbrook/header").then(d => {
            this.setState({ cityIOheader: d });
            // then set the view to the table's header
            this._setViewStateToTableHeader();
        });

        await getCityIO(this.cityIObaseURL + "grasbrook/grid").then(d => {
            gridData = d;
        });

        await getCityIO(
            this.cityIObaseURL + "grasbrook/interactive_grid_mapping"
        ).then(d => {
            interactiveGridMappingData = d;
        });

        await getCityIO(this.cityIObaseURL + "grasbrook/meta_grid").then(d => {
            geoJsonData = d;
        });
        //
        for (let i in interactiveGridMappingData) {
            geoJsonData.features[
                interactiveGridMappingData[i]
            ].properties.type = gridData[i][0];
        }
        this.setState({ geoJsonData: geoJsonData });
        //
        await getCityIO(this.cityIObaseURL + "grasbrook/ABM").then(d =>
            this.setState({ ABMdata: d })
        );

        await getCityIO(this.cityIObaseURL + "grasbrook/access").then(d => {
            let coordinates = d.features.map(d => d.geometry.coordinates);
            let values = d.features.map(d => d.properties);
            let arr = [];

            for (let i = 0; i < coordinates.length; i++) {
                arr.push({
                    coordinates: coordinates[i],
                    values: values[i]
                });
            }
            this.setState({ accessData: arr });
        });

        //     this.cityIObaseURL + "grasbrook_test/noise_result"
    }

    _rightClickViewRotate() {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", evt => evt.preventDefault());
    }

    _handlePicking = (event, picked) => {
        // https://github.com/uber/deck.gl/blob/master/docs/api-reference/deck.md#pickobjects
        const mulipleObjPicked = this.deckGL.pickObjects({
            x: event.x - 50,
            y: event.y - 50,
            width: 100,
            height: 100
        });

        mulipleObjPicked.forEach(picked => {
            /*
            allow only to pick cells that are
            not of CityScope TUI & that are interactable
            so to not overlap TUI activity  
            */
            if (
                picked.object.properties.land_use === "M1" &&
                !picked.object.properties.interactive
            ) {
                const pickedProps = this.state.geoJsonData.features[
                    picked.index
                ].properties;
                pickedProps.old_height = pickedProps.height;
                pickedProps.color = this.colors.picked;
                if (!pickedProps.picked) {
                    const rndheight = Math.random() * 200;

                    pickedProps.height = rndheight;
                    pickedProps.picked = true;
                } else {
                    pickedProps.height = pickedProps.old_height;
                }
            }
        });

        this.setState({
            geoJsonData: this.state.geoJsonData
        });
    };

    _handleHovered = (hovered, event) => {
        if (
            hovered.object &&
            hovered.object.properties.land_use === "M1" &&
            !hovered.object.properties.interactive
        ) {
            const hoveredProps = this.state.geoJsonData.features[hovered.index]
                .properties;
            // color the hovered object and wait
            hoveredProps.color = this.colors.hovered;

            hoveredProps.oldColor = hoveredProps.picked
                ? this.colors.picked
                : this.colors.idle;
            setTimeout(() => {
                hoveredProps.color = hoveredProps.oldColor;
            }, 500);
        }
    };

    _renderLayers() {
        const layersProps = this.props.menu;

        let layers = [
            new GeoJsonLayer({
                /*
                Edit geojson:
                https://codesandbox.io/s/7y3qk00o0q
                */

                id: "GEOJSON_GRID",
                data: this.state.geoJsonData,
                onClick: (event, picked) => {
                    this._handlePicking(event, picked);
                },
                onHover: (event, hovered) => {
                    this._handleHovered(event, hovered);
                },

                visible: layersProps.includes("GEOJSON_GRID") ? true : false,
                pickable: true,
                extruded: true,
                lineWidthScale: 1,
                lineWidthMinPixels: 2,
                getElevation: d =>
                    d.properties.land_use === "M1" ? d.properties.height : 1,
                getFillColor: d =>
                    d.properties.type !== undefined
                        ? this.colors.picked
                        : d.properties.color
                        ? d.properties.color
                        : d.properties.land_use === "M1"
                        ? this.colors.idle
                        : this.colors.water,

                updateTriggers: {
                    getElevation: d => d.properties.height,
                    getFillColor: d => d.properties.color
                },
                transitions: {
                    getElevation: 250,
                    getFillColor: 250
                }
            }),

            new TripsLayer({
                id: "ABM",
                visible: layersProps.includes("ABM") ? true : false,
                data: this.state.ABMdata,
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
                visible: layersProps.includes("PATHS") ? true : false,
                _shadow: false,
                data: this.state.ABMdata,
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
                visible: layersProps.includes("ACCESS") ? true : false,
                colorRange: [
                    [213, 62, 79],
                    [252, 141, 89],
                    [254, 224, 139],
                    [230, 245, 152],
                    [153, 213, 148],
                    [50, 136, 189]
                ],
                radiusPixels: 100,
                data: this.state.accessData,
                getPosition: d => d.coordinates,
                getWeight: d => d.values.nightlife
            })
        ];

        return layers;
    }

    _setViewStateToTableHeader() {
        this.setState({
            viewState: {
                ...this.state.viewState,
                longitude: this.state.cityIOheader.spatial.longitude,
                latitude: this.state.cityIOheader.spatial.latitude,
                zoom: 14,
                pitch: 0,
                bearing: 180 - this.state.cityIOheader.spatial.rotation
            }
        });
    }

    render() {
        return (
            <DeckGL
                ref={deck => {
                    this.deckGL = deck;
                }}
                viewState={this.state.viewState}
                onViewStateChange={this._onViewStateChange}
                className="map"
                layers={this._renderLayers()}
                effects={this._effects}
                controller={true}
            >
                <StaticMap
                    asyncRender={true}
                    dragRotate={true}
                    reuseMaps={true}
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                    preventStyleDiffing={true}
                />
            </DeckGL>
        );
    }
}
