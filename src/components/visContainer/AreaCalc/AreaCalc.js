import React, { useState } from "react";
import { rgbToHex } from "../../../services/utils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DownloadRawData from "../DownloadRawData/DownloadRawData";
import { RadialChart, Hint } from "react-vis";

export default function AreaCalc(props) {
    const [hoveredRadial, setHoveredRadial] = useState(false);

    const calcArea = () => {
        let gridProps = props.cityioData.GEOGRID.properties;
        let cellSize = gridProps.header.cellSize;
        let geoGridData = props.cityioData.GEOGRIDDATA;
        let calcAreaObj = {};
        geoGridData.forEach((gridCellData) => {
            let typeName = gridCellData.name;
            if (
                // if this type is not null
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

    const data = calcArea();
    const radialRadius = 300;

    return (
        <List>
            <ListItem>
                {hoveredRadial.name ? (
                    <React.Fragment>
                        <p>
                            {hoveredRadial.name}: {hoveredRadial.area}
                            sqm
                        </p>
                    </React.Fragment>
                ) : (
                    <p>Hover on chart...</p>
                )}
            </ListItem>

            <ListItem>
                <RadialChart
                    colorType="literal"
                    animation={true}
                    className={"donut-chart-example"}
                    innerRadius={radialRadius / 2 - radialRadius / 5}
                    radius={radialRadius / 2}
                    getLabel={(d) => d.name}
                    labelsRadiusMultiplier={1}
                    labelsStyle={{ fontSize: 10, fill: "#000" }}
                    showLabels
                    getAngle={(d) => d.area}
                    data={data.children}
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
                                Area: {hoveredRadial.area} sqm
                            </div>
                        </Hint>
                    )}
                </RadialChart>
            </ListItem>
            <DownloadRawData data={data} title={"area data"} />
        </List>
    );
}
