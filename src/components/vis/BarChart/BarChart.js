import React, { Component } from "react";
import {
    FlexibleWidthXYPlot,
    XAxis,
    ChartLabel,
    YAxis,
    VerticalBarSeries,
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartData: null,
        };
        this.colorRange = ["#fc03ec", "#79C7E3"];
    }

    componentDidMount() {
        console.log("....init BarChart");
        this.generateData();
    }

    /**
   
    [
    { x: 2, y: 10 },
    { x: 4, y: 5 },
    { x: 12, y: 15 },
    ]
     */

    generateData() {
        const indicators = this.props.cityioData.indicators;

        let dataArr = [];
        for (let i = 0; i < indicators.length; i++) {
            dataArr.push({
                x: indicators[i].name,
                y: indicators[i].value,
            });
        }
        this.setState({ barChartData: dataArr });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.cityioData.indicators !== this.props.cityioData.indicators
        ) {
            this.generateData();
        }
    }

    render() {
        if (this.state.barChartData) {
            console.log(this.state.barChartData);

            return (
                <FlexibleWidthXYPlot
                    color={this.colorRange[1]}
                    opacity={0.5}
                    xType="ordinal"
                    width={300}
                    height={500}
                    stackBy="y"
                    yDomain={[0, 1]}
                >
                    <XAxis
                        style={{
                            text: {
                                fill: "#fff",
                                fontSize: "0.6em",
                            },
                        }}
                        tickLabelAngle={90}
                    />
                    <YAxis style={{ text: { fill: "#fff" } }} />
                    <VerticalBarSeries data={this.state.barChartData} />
                </FlexibleWidthXYPlot>
            );
        } else return null;
    }
}

export default Radar;
