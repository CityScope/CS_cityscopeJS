import React, { Component } from "react";
import { CircularGridLines, RadarChart } from "react-vis";
import settings from "../../../settings/settings.json";
import "../../../../node_modules/react-vis/dist/style.css";
import "./Radar.css";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.domain = settings.radar.domain;
        this.colorRange = settings.radar.colorRange;
        this.state = {
            cityioData: {},
            radarData: []
        };

        this.radarSize = 700;
    }

    generateData() {
        let data = {};
        let dataStatic = {};
        for (let i in this.domain) {
            // b/s data for now
            data[this.domain[i].name] = this.props.cityioData.grid[i][0] / 10;
            // compared with other b/s data
            dataStatic[this.domain[i].name] = i / this.domain.length;
        }
        this.setState({ radarData: [data, dataStatic] });
    }

    componentDidMount() {
        console.log(">> init radar");

        this.generateData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cityioData !== this.props.cityioData) {
            this.setState({ cityioData: this.props.cityioData });
            console.log("new radar data..");
            this.generateData();
        }
    }

    render() {
        return (
            <RadarChart
                className="Radar blur"
                animation
                data={this.state.radarData}
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
                    left: this.radarSize / 6,
                    top: this.radarSize / 6,
                    bottom: this.radarSize / 6,
                    right: this.radarSize / 6
                }}
                width={this.radarSize}
                height={this.radarSize}
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
                    tickValues={[...new Array(11)].map((v, i) => i / 10 - 1)}
                />
            </RadarChart>
        );
    }
}

export default Radar;
