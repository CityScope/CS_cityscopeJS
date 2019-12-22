import React, { Component } from "react";
import { CircularGridLines, RadarChart } from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";
import "./Radar.css";
import settings from "../../../settings/settings.json";

export default class Radar extends Component {
    constructor(props) {
        super(props);

        this.domain = settings.radar.domain;
        this.colorRange = settings.radar.colorRange;
        this.state = {
            cityIOmodulesData: null,
            data: []
        };
    }

    generateData() {
        let data = {};
        let dataStatic = {};
        for (let i in this.domain) {
            data[this.domain[i].name] = Math.random();
            dataStatic[this.domain[i].name] = Math.random();
        }
        this.setState({ data: [data, dataStatic] });
    }

    componentDidUpdate() {
        if (this.props.cityIOmodulesData !== this.state.cityIOmodulesData) {
            console.log("new radar data");

            this.setState({ cityIOmodulesData: this.props.cityIOmodulesData });
            this.generateData();
        }
    }

    render() {
        return (
            <RadarChart
                className="Radar blur"
                animation
                data={this.state.data}
                domains={this.domain}
                colorRange={this.colorRange}
                style={{
                    polygons: {
                        fillOpacity: 0.2,
                        strokeWidth: 2
                    },
                    axes: {
                        text: {
                            opacity: 0,
                            fontWeight: 700,
                            fill: "white"
                        },
                        strokeWidth: 0
                    },
                    labels: {
                        textAnchor: "middle",
                        fontSize: 12,
                        fontWeight: "600",
                        fill: "white"
                    }
                }}
                margin={{
                    left: 100,
                    top: 100,
                    bottom: 100,
                    right: 100
                }}
                width={700}
                height={700}
            >
                <CircularGridLines
                    style={{
                        fill: "white",
                        fillOpacity: 0.1,
                        backgroundColor: "#fff",
                        opacity: 0.5,
                        stroke: "white",
                        width: 0.1
                    }}
                    tickValues={[...new Array(10)].map((v, i) => i / 10 - 1)}
                />
            </RadarChart>
        );
    }
}
