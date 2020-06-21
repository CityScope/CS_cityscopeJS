import React from "react";
import { testHex, hexToRgb } from "../../baseMap/baseMapUtils";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

export const SelectionTarget = (props) => {
    const selectedType = props.selectedType;
    if (!props.mousePos) return null;
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

    let msg =
        props.selectedType.interactive !== "false"
            ? selectedType.name
            : "(x) not-interactive";
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
                    fontSize: "0.5em",
                }}
            >
                {msg}:
            </div>
        </div>
    );
};
