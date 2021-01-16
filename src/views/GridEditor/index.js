import React, { Component } from "react";
import EditorMap from "./EditorMap/EditorMap";
import EditorMenu from "./EditorMenu/EditorMenu";
// import Provider from "../../redux/Provider";
// import store from "../../redux/store";
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
