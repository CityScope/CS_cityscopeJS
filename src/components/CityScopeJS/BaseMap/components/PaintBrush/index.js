import React from "react";
import { PaintBrush } from "./PaintBrush";
import { CellMeta } from "../CellMeta";

export default function PaintBrushContainer({
    editOn,
    mousePos,
    selectedType,
    pickingRadius,
    mouseDown,
    hoveredObj,
}) {
    if (editOn) {
        return (
            selectedType && (
                <PaintBrush
                    mousePos={mousePos}
                    selectedType={selectedType}
                    divSize={pickingRadius}
                    mouseDown={mouseDown}
                    hoveredCells={hoveredObj}
                />
            )
        );
    } else {
        return (
            hoveredObj && (
                <CellMeta mousePos={mousePos} hoveredObj={hoveredObj} />
            )
        );
    }
}
