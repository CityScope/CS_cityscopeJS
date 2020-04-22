import React, { Component } from "react";
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    VerticalBarSeries,
} from "react-vis";
import "../../../../node_modules/react-vis/dist/style.css";

class Radar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("....init BarChart");
    }

    render() {
        if (this.props.cityioData.indicators) {
            return (
                <XYPlot
                    width={500}
                    height={500}
                    stackBy="y"
                    className="BarChart blur"
                >
                    <VerticalGridLines />
                    <XAxis />
                    <YAxis />
                    <VerticalBarSeries
                        data={[
                            { x: 2, y: 10 },
                            { x: 4, y: 5 },
                            { x: 5, y: 15 },
                        ]}
                    />
                    <VerticalBarSeries
                        data={[
                            { x: 2, y: 12 },
                            { x: 4, y: 2 },
                            { x: 5, y: 11 },
                        ]}
                    />
                </XYPlot>
            );
        } else return null;
    }
}

export default Radar;
