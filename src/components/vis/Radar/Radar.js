import React, { Component } from "react";
import {
    CircularGridLines,
    RadarChart,
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";

import "./Radar.css";

/**
 * 
 * 
 *  "domain": [
            { "name": "amazing city", "domain": [0, 1] },
            { "name": "validated innovation", "domain": [0, 1] },
            { "name": "predicted happiness", "domain": [0, 1] },
            { "name": "wow mix-use", "domain": [0, 1] },
            { "name": "ok buildings", "domain": [0, 1] },
            { "name": "fun crime rates", "domain": [0, 1] },
            { "name": "success urbanism", "domain": [0, 1] },
            { "name": "happy AI", "domain": [0, 1] },
            { "name": "free parking", "domain": [0, 1] },
            { "name": "deep chainy", "domain": [0, 1] },
            { "name": "failed urbanism", "domain": [0, 1] },
            { "name": "Data for free", "domain": [0, 1] },
            { "name": "vapor energy", "domain": [0, 1] },
            { "name": "deep chainy", "domain": [0, 1] }
        ],
 */
class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domains: [],
            radarData: [],

            useCanvas: false,
        };
        this.radarSize = 700;

        this.colorRange = ["#fc03ec", "#79C7E3"];
    }

    generateData() {
        const indicators = this.props.cityioData.indicators;
        let radarData = {};
        let domains = [];
        for (let i = 0; i < indicators.length; i++) {
            radarData[indicators[i].name] = indicators[i].value;
            indicators[i].domain = [0, 1];
            domains.push(indicators[i]);
        }
        this.setState({ radarData: [radarData], domains: domains });
    }

    componentDidMount() {
        console.log("....init radar");
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
        const BarSeries = this.state.useCanvas
            ? VerticalBarSeriesCanvas
            : VerticalBarSeries;

        if (this.props.cityioData.indicators) {
            return (
                <div>
                    <XYPlot width={300} height={300} stackBy="y">
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />
                        <BarSeries
                            data={[
                                { x: 2, y: 10 },
                                { x: 4, y: 5 },
                                { x: 5, y: 15 },
                            ]}
                        />
                        <BarSeries
                            data={[
                                { x: 2, y: 12 },
                                { x: 4, y: 2 },
                                { x: 5, y: 11 },
                            ]}
                        />
                    </XYPlot>

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
                                fontSize: 11,
                                fontWeight: "600",
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
                                backgroundColor: "#fff",
                                opacity: 0.5,
                                stroke: "white",
                                width: 0.1,
                            }}
                            tickValues={[...new Array(11)].map(
                                (v, i) => i / 10 - 1
                            )}
                        />
                    </RadarChart>
                </div>
            );
        } else return null;
    }
}

export default Radar;
