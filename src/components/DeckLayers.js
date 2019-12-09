import DeckGL, { PathLayer, GeoJsonLayer, TripsLayer } from "deck.gl";
import {
    LightingEffect,
    AmbientLight,
    _SunLight as SunLight
} from "@deck.gl/core";

import React, { Component } from "react";
import CityIO from "./CityIO";

export default class DeckLayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoJsonData: null,
            ABMdata: null,
            animationFrame: null,
            startSimHour: 60 * 60 * 7,
            endSimHour: 60 * 60 * 14,
            simPaceValue: 10,
            time: 60 * 60 * 7
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
    }

    animate() {
        const { time, startSimHour, simPaceValue } = this.state;
        let loopLength = this.state.endSimHour - this.state.startSimHour;
        if (time >= startSimHour + loopLength - 1) {
            this.setState({ time: this.state.startSimHour });
        } else {
            this.setState({ time: time + simPaceValue });
        }

        this.animationFrame = window.requestAnimationFrame(
            this.animate.bind(this)
        );
    }

    componentWillUnmount() {
        if (this.animationFrame != null) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        fetch("https://cityio.media.mit.edu/api/table/grasbrook/meta_grid")
            .then(response => response.json())
            .then(result => {
                this.setState({ geoJsonData: result });
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });

        fetch("https://cityio.media.mit.edu/api/table/grasbrook/ABM")
            .then(response => response.json())
            .then(result => {
                this.setState({ ABMdata: result });
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });

        this.animate();
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

    _handlePicking = picked => {
        const thisFeature = this.state.geoJsonData.features[picked.index]
            .properties;
        console.log(thisFeature);

        if (!thisFeature.picked || thisFeature.picked == false) {
            thisFeature.old_height = thisFeature.height;
            thisFeature.picked = true;
            thisFeature.color = [255, 255, 0, 200];
            thisFeature.height = 200;
        } else {
            thisFeature.height = thisFeature.old_height;
            thisFeature.picked = false;
            thisFeature.color = [255, 0, 255, 200];
        }

        this.setState({
            geoJsonData: this.state.geoJsonData
        });
    };

    render() {
        // this._calculateSunPosition();
        // get viewport as prop from parent
        const { viewport } = this.props;
        let layers = [
            new TripsLayer({
                // visible: false,
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
                    }
                },
                getWidth: 2,
                rounded: true,
                trailLength: 100,
                currentTime: this.state.time
            }),

            new PathLayer({
                visible: false,
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
                        d.path[i][2] = 100;
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
                    }
                },
                getWidth: 0.5
            }),

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
                lineWidthScale: 20,
                lineWidthMinPixels: 2,
                getElevation: d =>
                    d.properties.land_use === "M1" ? d.properties.height : 1,
                getFillColor: d =>
                    d.properties.color
                        ? d.properties.color
                        : d.properties.land_use === "M1"
                        ? [255, 0, 255, 200]
                        : [255, 255, 255, 100],

                updateTriggers: {
                    getElevation: d => d.properties.height,
                    getFillColor: d => d.properties.color
                },
                transitions: { getElevation: 500, getFillColor: 500 },

                getRadius: 100,
                getLineWidth: 1,
                onClick: picked => {
                    if (picked.object.properties.land_use === "M1")
                        this._handlePicking(picked);
                }
            })
        ];
        return (
            <DeckGL
                effects={this._effects}
                viewState={viewport}
                layers={layers}
            ></DeckGL>
        );
    }
}
