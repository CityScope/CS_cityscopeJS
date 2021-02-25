import React from "react";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

export default function SelectionTarget(props) {
    if (!props.mousePos) return null;
    const mousePos = props.mousePos;
    const selectedType = props.selectedType;
    const divSize = props.divSize;

    const colorTrans =
        "rgba(" +
        selectedType.color[0] +
        "," +
        selectedType.color[1] +
        "," +
        selectedType.color[2] +
        ",0.6)";
    let mouseX = mousePos.clientX - divSize / 2;
    let mouseY = mousePos.clientY - divSize / 2;
    return (
        <div
            style={{
                border: "2px solid",
                backgroundColor: props.mouseDown ? colorTrans : "rgba(0,0,0,0)",
                borderColor: selectedType.color,
                color: selectedType.color,
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
                {selectedType.name}
            </div>
        </div>
    );
}
