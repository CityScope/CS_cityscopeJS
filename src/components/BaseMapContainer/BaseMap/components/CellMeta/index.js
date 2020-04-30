import React from "react";

/**
 *
 * Cell meta comp
 */

function CellMeta(props) {
    if (!props.mousePos) return null;
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
}

export default CellMeta;
