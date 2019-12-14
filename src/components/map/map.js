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
        this.state = {
            geoJsonData: null,
            accessData: null,
            ABMdata: null,
            viewport: {
                longitude: 9.9937,
                latitude: 53.5511,
                zoom: 13,
                pitch: 0,
                bearing: -325
            },
            componentDidMount: false
        };

        const ambientLight = new AmbientLight({
            color: [255, 255, 255],
            intensity: 1
        });

        const dirLight = new SunLight({
            timestamp: Date.UTC(2019, 7, 1, 10),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true
        });

        this.day = Date.UTC(2019, 7, 1, this.state.time);

        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.3];
        this._effects = [lightingEffect];

        this.cityIObaseURL = "https://cityio.media.mit.edu/api/table/";

        this.colors = {
            white: [255, 255, 255, 200],
            picked: [255, 191, 0, 200],
            water: [0, 0, 255, 100]
        };

        this.animationFrame = null;
        this.startSimHour = 60 * 60 * 7;
        this.endSimHour = 60 * 60 * 14;
        this.simPaceValue = 1000;
    }

    animate() {
        const { startSimHour, simPaceValue, endSimHour } = this;

        let loopLength = endSimHour - startSimHour;
        const animationSpeed = simPaceValue;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;
        let time =
            ((timestamp % loopTime) / loopTime) * loopLength + startSimHour;
        if (time > endSimHour) time = startSimHour;
        this.setState({
            time: time
        });
        this._animationFrame = window.requestAnimationFrame(
            this.animate.bind(this)
        );
    }

    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        // hack  to allow view rotatae
        this._rightClickViewRotate();
        //  get data
        this._getLayersData();
        // Animate
        this.animate();
    }

    async _getLayersData() {
        let gridData = null;
        let interactiveGridMappingData = null;
        let geoJsonData = null;

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

        // await getCityIO(
        //     this.cityIObaseURL + "grasbrook_test/noise_result"
        // ).then(d => {
        //     console.log(d);
        // });

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
    }

    _calculateSunPosition() {
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

    _rightClickViewRotate() {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", evt => evt.preventDefault());
    }

    _handlePicking = (event, picked) => {
        // console.log(event);

        // https://github.com/uber/deck.gl/blob/master/docs/api-reference/deck.md#pickobjects
        const mulipleObjPicked = this.deckGL.pickObjects({
            x: event.x - 50,
            y: event.y - 50,
            width: 100,
            height: 100
        });

        mulipleObjPicked.forEach(picked => {
            if (picked.object.properties.land_use === "M1") {
                const pickedProps = this.state.geoJsonData.features[
                    picked.index
                ].properties;
                pickedProps.old_height = pickedProps.height;
                pickedProps.color = this.colors.picked;
                if (!pickedProps.picked) {
                    pickedProps.height = 20;
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

    _renderLayers() {
        let layers = [
            new GeoJsonLayer({
                // ! Edit geojson
                // ! https://codesandbox.io/s/7y3qk00o0q
                // !
                id: "GEOJSON_GRID",
                data: this.state.geoJsonData,
                onClick: (event, picked) => {
                    this._handlePicking(event, picked);
                },
                visible: true,
                pickable: true,
                stroked: true,
                filled: true,
                extruded: true,
                lineWidthScale: 1,
                lineWidthMinPixels: 2,
                getElevation: d =>
                    d.properties.land_use === "M1" ? d.properties.height : 1,
                getFillColor: d =>
                    d.properties.type !== undefined
                        ? [255, 180, 0, 100]
                        : d.properties.color
                        ? d.properties.color
                        : d.properties.land_use === "M1"
                        ? this.colors.white
                        : this.colors.water,

                updateTriggers: {
                    getElevation: d => d.properties.height,
                    getFillColor: d => d.properties.color
                },
                transitions: { getElevation: 100, getFillColor: 500 },

                getRadius: 100,
                getLineWidth: 1
            }),

            new TripsLayer({
                visible: true,
                id: "modes",
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
                rounded: true,
                trailLength: 100,
                currentTime: this.state.time
            }),

            new PathLayer({
                _shadow: false,
                visible: true,
                id: "line",
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

                getWidth: 0.5
            }),
            new HeatmapLayer({
                colorRange: [
                    [213, 62, 79],
                    [252, 141, 89],
                    [254, 224, 139],
                    [230, 245, 152],
                    [153, 213, 148],
                    [50, 136, 189]
                ],

                id: "heatmapLayer",
                radiusPixels: 100,
                visible: false,
                data: this.state.accessData,
                getPosition: d => d.coordinates,
                getWeight: d => d.values.nightlife
            })
        ];

        return layers;
    }

    render() {
        // this._calculateSunPosition();

        return (
            <DeckGL
                ref={deck => {
                    this.deckGL = deck;
                }}
                className="map"
                layers={this._renderLayers()}
                effects={this._effects}
                initialViewState={this.state.viewport}
                viewState={this.state.viewport}
                controller={true}
            >
                <StaticMap
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
