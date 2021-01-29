import React from "react";
import { testHex, hexToRgb } from "../../utils/BaseMapUtils";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

export const PaintBrush = (props) => {
    if (!props.mousePos || !props.hoveredCells) return null;
    const selectedType = props.selectedType;

    const isInteractiveCell = props.hoveredCells.object.properties.interactive;
    const mousePos = props.mousePos;
    const divSize = props.divSize;
    let col = selectedType.color;
    if (testHex(col)) {
        col = hexToRgb(col);
    }
    const color = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
    const colorTrans = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.6)";
    let mouseX = mousePos.clientX - divSize / 2;
    let mouseY = mousePos.clientY - divSize / 2;

    let msg = isInteractiveCell ? selectedType.name : "Not-interactive";
    return (
        <div
            style={{
                border: "2px solid",
                backgroundColor: props.mouseDown ? colorTrans : "rgba(0,0,0,0)",
                borderColor: color,
                color: color,
                borderRadius: "15%",
                position: "fixed",
                zIndex: 1,
                pointerEvents: "none",
                width: divSize,
                height: divSize,
                left: mouseX,
                top: mouseY,
            }}
        >
            <div
                style={{
                    position: "relative",
                    left: divSize + 10,
                    fontSize: "0.8em",
                }}
            >
                {!isInteractiveCell && <ErrorOutlineIcon />}
                {msg}:
            </div>
        </div>
    );
};
