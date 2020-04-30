import React from "react";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

function SelectionTarget(props) {
    const selectedType = props.selectedType;
    if (!props.mousePos) return null;
    const mousePos = props.mousePos;

    const divSize = props.divSize;
    const rc = selectedType.color;
    const color = "rgb(" + rc[0] + "," + rc[1] + "," + rc[2] + ")";
    const colorTrans = "rgba(" + rc[0] + "," + rc[1] + "," + rc[2] + ",0.6)";
    let mouseX = mousePos.clientX - divSize / 2;
    let mouseY = mousePos.clientY - divSize / 2;
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
                top: mouseY
            }}
        >
            <div
                style={{
                    position: "relative",
                    left: divSize + 10,
                    fontSize: "0.5em"
                }}
            >
                {selectedType.name}
            </div>
        </div>
    );
}

export default SelectionTarget;
