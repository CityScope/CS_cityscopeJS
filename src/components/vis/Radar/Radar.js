import React, { Component } from "react";
import { CircularGridLines, RadarChart } from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";
import "./Radar.css";

const domainRange = [0, 1];
const DOMAIN = [
    { name: "amazing city", domain: domainRange },
    { name: "validated innovation", domain: domainRange },
    { name: "predicted happiness", domain: domainRange },
    { name: "mix-use in heaven", domain: domainRange },
    { name: "cool buildings", domain: domainRange },
    { name: "fun crime levels", domain: domainRange },
    { name: "success urbanism", domain: domainRange },
    { name: "happy agents", domain: domainRange },
    { name: "parking bliss", domain: domainRange },
    { name: "deep swarm chains", domain: domainRange }
];

let staticRadarData = {};
for (let i in DOMAIN) {
    staticRadarData[DOMAIN[i].name] = Math.random() * DOMAIN[i].domain[1];
}

function generateData(cityioGrid) {
    let radarData = {};
    for (let i in DOMAIN) {
        let foo = 1 / (cityioGrid[i][0] + 1);
        radarData[DOMAIN[i].name] = foo;
    }
    return [radarData, staticRadarData];
}

export default class Radar extends Component {
    state = {
        data: [staticRadarData, staticRadarData],
        colorRange: ["#fc03ec", "#79C7E3"]
    };

    componentDidUpdate(props) {
        if (props.doneFetching) {
            this.setState({
                data: generateData(props.cityIOdata)
            });
        }
    }

    render() {
        const { data, colorRange } = this.state;
        return (
            <div className="Radar">
                <RadarChart
                    animation
                    data={data}
                    domains={DOMAIN}
                    colorRange={colorRange}
                    style={{
                        polygons: {
                            fillOpacity: 0.2,
                            strokeWidth: 2
                        },
                        axes: {
                            text: {
                                opacity: 0,
                                fontWeight: 500,
                                fill: "white"
                            },
                            strokeWidth: 0.1
                        },
                        labels: {
                            textAnchor: "middle",
                            fontSize: 10,
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
                    width={400}
                    height={400}
                >
                    <CircularGridLines
                        style={{
                            fill: "white",
                            fillOpacity: 0.1,
                            backgroundColor: "#fff",
                            opacity: 1,
                            stroke: "white"
                        }}
                        tickValues={[...new Array(10)].map(
                            (v, i) => i / 10 - 1
                        )}
                    />
                </RadarChart>
            </div>
        );
    }
}
