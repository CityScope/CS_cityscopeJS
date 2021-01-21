import React, { useState, useEffect } from "react";
import { CircularGridLines, RadarChart } from "react-vis";
import "react-vis/dist/style.css";
import "./Radar.css";
import { DiscreteColorLegend } from "react-vis";

const radarSize = 100;

export default function Radar(props) {
    console.log('r');
    
    const [setRadarData, radarData] = useState(null);

    const colorRange = ["#fc03ec", "#79C7E3"];

    const createRadarData = (indicators) => {
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
        const d = { radarData: [radarData, refData], domains: domains };
        return d;
    };

    useEffect(() => {
        if (
            props &&
            props.cityioData &&
            props.cityioData.indicators &&
            props.cityioData.indicators.length > 0
        ) {
            const d = createRadarData(props.cityioData.indicators);
            console.log(d);

            setRadarData(d);
        }
    }, [props]);

    return (
        <div>
            {props.cityioData.indicators && false && (
                <>
                    <RadarChart
                        className="Radar blur"
                        animation
                        data={radarData.radarData}
                        domains={radarData.domains}
                        colorRange={colorRange}
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
                            left: radarSize / 6,
                            top: radarSize / 6,
                            bottom: radarSize / 6,
                            right: radarSize / 6,
                        }}
                        width={radarSize}
                        height={radarSize}
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
                        colors={colorRange}
                    />
                </>
            )}
        </div>
    );
}
