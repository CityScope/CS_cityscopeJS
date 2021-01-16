import React, { Component } from "react";
import { CircularGridLines, RadarChart } from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css";
import "./Radar.css";
import { DiscreteColorLegend } from "react-vis";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domains: [],
            radarData: [],
        };
        this.radarSize = this.props.drawerWidth - 50;

        this.colorRange = ["#fc03ec", "#79C7E3"];
    }

    generateData() {
        const indicators = this.props.cityioData.indicators;
        let radarData = {};
        let refData = {};
        let domains = [];
        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i].viz_type === "radar") {
                radarData[indicators[i].name] = [indicators[i].value];
                refData[indicators[i].name] = [indicators[i].ref_value];
                indicators[i].domain = [0, 1];
                domains.push(indicators[i]);
            }
        }
        this.setState({ radarData: [radarData, refData], domains: domains });
    }

    componentDidMount() {
        this.setState({ indicators: this.props.indicators });
        this.generateData();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.cityioData.indicators !== this.props.cityioData.indicators
        ) {
            this.setState({ indicators: this.props.indicators });
            console.log("new radar data..");
            this.generateData();
        }
    }

    render() {
        if (this.props.cityioData.indicators) {
            return (
                <div>
                    <RadarChart
                        className="Radar blur"
                        animation
                        data={this.state.radarData}
                        domains={this.state.domains}
                        colorRange={this.colorRange}
                        style={{
                            polygons: {
                                fillOpacity: 0.2,
                                strokeWidth: 2,
                            },
                            axes: {
                                text: {
                                    opacity: 0,
                                    fontWeight: 700,
                                    fill: "white",
                                },
                                strokeWidth: 0,
                            },
                            labels: {
                                textAnchor: "middle",
                                fontSize: 10,
                                fill: "white",
                            },
                        }}
                        margin={{
                            left: this.radarSize / 6,
                            top: this.radarSize / 6,
                            bottom: this.radarSize / 6,
                            right: this.radarSize / 6,
                        }}
                        width={this.radarSize}
                        height={this.radarSize}
                    >
                        <CircularGridLines
                            style={{
                                fill: "white",
                                fillOpacity: 0.1,
                                backgroundColor: "#FFF",
                                opacity: 0.5,
                                stroke: "white",
                                width: 0.1,
                            }}
                            tickValues={[...new Array(11)].map(
                                (v, i) => i / 10 - 1
                            )}
                        />
                    </RadarChart>

                    <DiscreteColorLegend
                        items={["Design", "Reference"]}
                        colors={this.colorRange}
                    />
                </div>
            );
        } else return null;
    }
}

export default Radar;
