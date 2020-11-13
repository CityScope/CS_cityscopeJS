import React, { useState } from "react";
import { RadialChart, Hint } from "react-vis";
import Typography from "@material-ui/core/Typography";

export default function TypeInfo(props) {
    const radialRadius = 150;
    const [hoveredRadial, setHoveredRadial] = useState(false);

    const careateData = () => {
        let data = [];
        props.typeInfo.forEach((attr) => {            
            data.push({
                angle: attr.proportion,
                label: JSON.stringify(attr.use),
            });
        });

        return data;
    };

    const data = careateData();

    return (
        <RadialChart
            animation={true}
            className={"donut-chart-example"}
            innerRadius={radialRadius / 2 - radialRadius / 5}
            radius={radialRadius / 2}
            getLabel={(d) => d.label}
            labelsRadiusMultiplier={1}
            labelsStyle={{
                textAnchor: "middle",

                fontSize: 10,
                fill: "#FFF",
                textShadow: "2px 2px 2px #000",
            }}
            showLabels
            getAngle={(d) => d.angle}
            data={data}
            onValueMouseOver={(evt) => {
                setHoveredRadial(evt);
            }}
            onSeriesMouseOut={() => setHoveredRadial(false)}
            width={radialRadius}
            height={radialRadius}
            padAngle={0.02}
        >
            {hoveredRadial !== false && (
                <Hint value={hoveredRadial}>
                    <div
                        style={{
                            background: "rgba(0,0,0,0.8)",
                            fontSize: 14,
                        }}
                    >
                        <Typography variant={"caption"} gutterBottom>
                            {hoveredRadial.label}
                        </Typography>
                    </div>
                </Hint>
            )}
        </RadialChart>
    );
}
