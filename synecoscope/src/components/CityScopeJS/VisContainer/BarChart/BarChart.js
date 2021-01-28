import React, { Component } from "react";
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
} from "react-vis";
import "../../../../../node_modules/react-vis/dist/style.css";
import DownloadRawData from "../DownloadRawData/DownloadRawData";
import Typography from "@material-ui/core/Typography";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartData: null,
            hoverdNode: null,
        };
        this.colorRange = ["#fc03ec", "#79C7E3"];
    }

    componentDidMount() {
        this.generateData();
    }

    /**
   data format 
    [
    { x: 2, y: 10 },
    { x: 4, y: 5 },
    { x: 12, y: 15 },
    ]
     */

    generateData() {
        const indicators = this.props.cityioData.indicators;

        let dataArr = [];
        // let refDataArr = [];
        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i].viz_type === "bar") {
                dataArr.push({
                    x: indicators[i].name,
                    y: indicators[i].value,
                });

                // refDataArr.push({
                //     x: indicators[i].name,
                //     y: indicators[i].ref_value,
                // });
            }
        }

        this.setState({
            barChartData: dataArr,
            // refChartData: refDataArr
        });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.cityioData.indicators !== this.props.cityioData.indicators
        ) {
            this.generateData();
        }
    }

    render() {
        const { hoveredNode } = this.state;

        return (
            <>
                {this.state.barChartData && (
                    <div>
                        {hoveredNode && (
                            <Typography gutterBottom>
                                {hoveredNode.x} : {hoveredNode.y}
                            </Typography>
                        )}

                        <FlexibleWidthXYPlot
                            opacity={0.2}
                            xType="ordinal"
                            width={this.props.drawerWidth - 50}
                            height={this.props.drawerWidth - 50}
                            stackBy="y"
                            yDomain={[0, 1]}
                        >
                            <XAxis
                                style={{
                                    text: {
                                        fill: "#FFF",
                                    },
                                }}
                                tickLabelAngle={90}
                            />
                            <YAxis style={{ text: { fill: "#FFF" } }} />
                            <VerticalBarSeries
                                animation={true}
                                onValueMouseOver={(d) => {
                                    this.setState({ hoveredNode: d });
                                }}
                                data={this.state.barChartData}
                            />
                            <VerticalBarSeries
                                animation={true}
                                onValueMouseOver={(d) => {
                                    this.setState({ hoveredNode: d });
                                }}
                                data={this.state.refChartData}
                            />
                        </FlexibleWidthXYPlot>

                        <DownloadRawData
                            data={this.props.cityioData.indicators}
                            title={"radar & bars data"}
                        />
                    </div>
                )}
            </>
        );
    }
}

export default Radar;
