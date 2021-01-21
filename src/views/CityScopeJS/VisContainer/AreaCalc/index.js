import React, { useState, useEffect } from "react";
import { rgbToHex } from "../../DeckglMap/utils/BaseMapUtils";
import { RadialChart, Hint } from "react-vis";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import "react-vis/dist/style.css";

export default function AreaCalc(props) {
    const radialRadius = 250;
    const [hoveredRadial, setHoveredRadial] = useState(false);
    const [areaData, setAreaData] = useState(null);

    const calcArea = () => {
        let gridProps = props.cityioData.GEOGRID.properties;
        let cellSize = gridProps.header.cellSize;
        let geoGridData = props.cityioData.GEOGRIDDATA;
        let calcAreaObj = {};
        geoGridData.forEach((gridCellData) => {
            let typeName = gridCellData.name;
            if (
                //    if this type is not null
                gridCellData.name !== "None"
            ) {
                if (calcAreaObj.hasOwnProperty(typeName)) {
                    calcAreaObj[typeName].count =
                        calcAreaObj[typeName].count + 1;
                    // avoid landuse with no height
                    let height =
                        gridCellData.height < 1 ? 1 : gridCellData.height;
                    calcAreaObj[typeName].area =
                        calcAreaObj[typeName].area + height * cellSize;
                } else {
                    calcAreaObj[typeName] = {};
                    calcAreaObj[typeName].area = 0;
                    calcAreaObj[typeName].count = 0;
                    calcAreaObj[typeName].name = typeName;
                    calcAreaObj[typeName].color = rgbToHex(
                        gridCellData.color[0],
                        gridCellData.color[1],
                        gridCellData.color[2]
                    );
                }
            }
        });
        //  convert to react-vis happy data format
        let radialData = [];
        for (const k in calcAreaObj) {
            radialData.push(calcAreaObj[k]);
        }

        let data = {
            children: radialData,
            color: 1,
        };

        return data;
    };

    useEffect(() => {
        setAreaData(calcArea());
    }, [props]);

    return (
        <List>
            {areaData && areaData.children && (
                <>
                    <ListItem>
                        {hoveredRadial.name ? (
                            <Typography gutterBottom>
                                {hoveredRadial.name}: {hoveredRadial.area} sqm
                            </Typography>
                        ) : (
                            <Typography gutterBottom>
                                Hover on chart...
                            </Typography>
                        )}
                    </ListItem>

                    <ListItem alignItems="center">
                        <RadialChart
                            colorType="literal"
                            animation={true}
                            className={"donut-chart-example"}
                            innerRadius={radialRadius / 2 - radialRadius / 5}
                            radius={radialRadius / 2}
                            getLabel={(d) => d.name}
                            labelsRadiusMultiplier={0.95}
                            labelsStyle={{
                                textAnchor: "middle",

                                fontSize: 11,
                                fill: "#FFF",
                                textShadow: "2px 2px 2px #000",
                            }}
                            showLabels
                            getAngle={(d) => d.area}
                            data={areaData.children}
                            onValueMouseOver={(evt) => setHoveredRadial(evt)}
                            onSeriesMouseOut={() => setHoveredRadial(false)}
                            width={radialRadius}
                            height={radialRadius}
                            padAngle={0.01}
                        >
                            {hoveredRadial !== false && (
                                <Hint value={hoveredRadial}>
                                    <div
                                        style={{
                                            background: "rgba(0,0,0,0.8)",
                                            fontSize: 14,
                                        }}
                                    >
                                        <Typography
                                            variant={"caption"}
                                            gutterBottom
                                        >
                                            Area: {hoveredRadial.area} sqm
                                        </Typography>
                                    </div>
                                </Hint>
                            )}
                        </RadialChart>
                    </ListItem>
                </>
            )}
        </List>
    );
}
