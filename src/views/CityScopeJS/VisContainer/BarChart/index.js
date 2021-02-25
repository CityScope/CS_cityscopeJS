import React, { useState, useEffect } from "react";
import {
    FlexibleWidthXYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
} from "react-vis";
import "react-vis/dist/style.css";
import { Typography, Box } from "@material-ui/core";

export default function BarChart(props) {
    const radarSize = 250;

    /**
   data format 
    [
    { x: 2, y: 10 },
    { x: 4, y: 5 },
    { x: 12, y: 15 },
    ]
     */

    const [barChartData, setBarChartData] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);

    useEffect(() => {
        if (
            props &&
            props.cityioData &&
            props.cityioData.indicators &&
            props.cityioData.indicators.length > 0
        ) {
            const d = generateData(props.cityioData.indicators);

            setBarChartData(d.barChartData);
        }
    }, [props]);

    const generateData = (indicators) => {
        let dataArr = [];

        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i].viz_type === "bar") {
                dataArr.push({
                    x: indicators[i].name,
                    y: indicators[i].value,
                });
            }
        }

        return {
            barChartData: dataArr,
        };
    };

    return (
        <>
            {barChartData && (
                <>
                    <Box flexDirection="column">
                        <Box alignContent="center" p={3}>
                            <FlexibleWidthXYPlot
                                opacity={0.2}
                                xType="ordinal"
                                width={radarSize}
                                height={radarSize}
                                stackBy="y"
                                yDomain={[0, 1]}
                            >
                                <XAxis
                                    style={{
                                        text: {
                                            fill: "#FFF",
                                            fontFamily: "Roboto Mono",
                                        },
                                    }}
                                    tickLabelAngle={90}
                                />
                                <YAxis style={{ text: { fill: "#FFF" } }} />
                                <VerticalBarSeries
                                    animation={true}
                                    onValueMouseOver={(d) => {
                                        setHoveredNode(d);
                                    }}
                                    data={barChartData}
                                />
                            </FlexibleWidthXYPlot>
                        </Box>
                        <Box alignContent="center">
                            {hoveredNode && (
                                <>
                                    <Typography variant="caption" gutterBottom>
                                        {hoveredNode.x}
                                    </Typography>
                                    <Box m={3} />
                                    <Typography gutterBottom>
                                        {hoveredNode.y}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}
