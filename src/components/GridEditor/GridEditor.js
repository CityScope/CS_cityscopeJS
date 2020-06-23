import React, { Component } from "react";
import EditorMap from "./EditorMap/EditorMap";
import EditorMenu from "./EditorMenu/EditorMenu";
export default class GridEditor extends Component {
    render() {
        return (
            <>
                <EditorMap />
                <EditorMenu />
            </>
        );
    }
}
