import React, { useState } from "react";
import { rgbToHex } from "../../../services/utils";
import { Treemap } from "react-vis";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

export default function AreaCalc(props) {
    const [hoveredNode, setHoveredNode] = useState(false);

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

    return (
        <List>
            <ListItem>
                {hoveredNode ? (
                    <React.Fragment>
                        <p>
                            {hoveredNode.data.name}: {hoveredNode.data.area} sqm
                        </p>
                    </React.Fragment>
                ) : (
                    <p>Hover on chart...</p>
                )}
            </ListItem>
            <ListItem>
                <Treemap
                    {...{
                        onLeafMouseOver: (evt) => setHoveredNode(evt),
                        onLeafMouseOut: () => setHoveredNode(false),

                        colorType: "literal",
                        animation: true,
                        className: "nested-tree-example",
                        data: data,
                        height: 400,
                        width: 400,
                        getSize: (d) => d.area,
                        getLabel: (d) => d.name + " cells: " + d.count,
                    }}
                />
            </ListItem>
        </List>
    );
}
