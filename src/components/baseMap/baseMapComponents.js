import React from "react";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

export const SelectionTarget = props => {
    const selectedType = props.selectedType;
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
};

/**
 *
 * Cell meta comp
 */

export const CellMeta = props => {
    const mousePos = props.mousePos;

    return (
        <div
            style={{
                borderRadius: "15%",
                position: "fixed",
                pointerEvents: "none",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "1vw",
                color: "rgba(255,255,255,0.9)",
                zIndex: 1,
                left: mousePos.clientX,
                top: mousePos.clientY,
                fontSize: "0.5em",
                fontWeight: 500
            }}
        >
            <p>
                Type:
                {props.hoveredObj.object.properties.name}
            </p>
            {props.hoveredObj.object.properties.height.constructor === Array ? (
                <>
                    <p>
                        Street Level Floors:
                        {props.hoveredObj.object.properties.height[0]}
                    </p>
                    <p>
                        Total Floors:
                        {props.hoveredObj.object.properties.height[1]}
                    </p>
                </>
            ) : (
                <p>
                    Total Floors:
                    {props.hoveredObj.object.properties.height}
                </p>
            )}
            <p>
                ID:
                {props.hoveredObj.object.properties.id}
            </p>
        </div>
    );
};
