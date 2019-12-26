import React, { Component } from "react";
import { connect } from "react-redux";

import { CircularGridLines, RadarChart } from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";
import "./Radar.css";
import settings from "../../../settings/settings.json";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.domain = settings.radar.domain;
        this.colorRange = settings.radar.colorRange;
        this.state = {
            cityioData: null,
            radarData: []
        };
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

    componentDidUpdate(prevProp) {
        if (prevProp.cityioData !== this.state.cityioData) {
            this.setState({ cityioData: this.props.cityioData });
            this.generateData();
            console.log("new radar data..");
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

const mapStateToProps = state => {
    return {
        // b/c of shallow checking
        // this must be specifc value
        cityioData: state
    };
};

export default connect(mapStateToProps, null)(Radar);
