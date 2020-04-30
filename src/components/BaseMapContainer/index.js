import React from "react";
import BaseMap from "./BaseMap";
import { useSelector } from "react-redux";
import { Layer } from "../prjMap/layer";

function BaseMapContainer() {
    const menu = useSelector(state => state.MENU);

    return (
        <div
            style={{
                background: "black",
                height: "100vh",
                width: "100vw",
                maxWidth: "100%",
                overflow: "hidden"
            }}
        >
            <Layer
                className="mapLayer"
                style={{
                    height: "100vh",
                    width: "100vw"
                }}
                isEditMode={menu.includes("KS")}
            >
                <BaseMap />
            </Layer>
        </div>
    );
}

export default BaseMapContainer;
