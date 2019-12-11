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
// import "./map.css";

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
            picked: [255, 255, 0, 200],
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

    _handlePicking = picked => {
        const thisFeature = this.state.geoJsonData.features[picked.index]
            .properties;

        if (!thisFeature.picked || thisFeature.picked === false) {
            thisFeature.old_height = thisFeature.height;
            thisFeature.picked = true;
            thisFeature.color = this.colors.picked;
            thisFeature.height = 200;
        } else {
            thisFeature.height = thisFeature.old_height;
            thisFeature.picked = false;
            thisFeature.color = this.colors.white;
        }

        this.setState({
            geoJsonData: this.state.geoJsonData
        });
    };

    multiSelect(e) {
        //! https://tgorkin.github.io/docs/developer-guide/interactivity
        // let objects = this.deck.pickObjects({
        //     x: 0,
        //     y: 0,
        //     width: 100,
        //     height: 100
        // });
    }

    _renderLayers() {
        let layers = [
            new GeoJsonLayer({
                // ! Edit geojson
                // ! https://codesandbox.io/s/7y3qk00o0q
                // !
                id: "GEOJSON_GRID",
                data: this.state.geoJsonData,
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
                getLineWidth: 1,
                onClick: picked => {
                    if (picked.object.properties.land_use === "M1")
                        this._handlePicking(picked);
                }
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
            })
        ];

        layers.push(this._accessLayer());
        return layers;
    }

    _accessLayer() {
        const accessData = this.state.accessData;

        return [
            // new LineLayer({
            //     id: "accessMap",
            //     data: arr,
            //     getSourcePosition: d => [
            //         d.coordinates[0],
            //         d.coordinates[1],
            //         0
            //     ],
            //     getTargetPosition: d => [
            //         d.coordinates[0],
            //         d.coordinates[1],
            //         // to be repalced with UI prop
            //         d.values.education * 100
            //     ],
            //     getWidth: 10,
            //     pickable: true
            // }),

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
                visible: true,
                data: accessData,
                getPosition: d => d.coordinates,
                getWeight: d => d.values.nightlife
            })
        ];
    }

    render() {
        // this._calculateSunPosition();
        return (
            <DeckGL
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
