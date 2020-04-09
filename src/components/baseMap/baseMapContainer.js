import React, { Component } from "react";
import MAP from "./baseMap";
import { connect } from "react-redux";
import { Layer } from "../prjMap/layer";

class MapContainer extends Component {
    _checkKeystone = () => {
        return this.props.menu.includes("KS") ? true : false;
    };

    render() {
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
                    isEditMode={this._checkKeystone()}
                >
                    <MAP
                        menu={this.props.menu}
                        selectedType={this.props.selectedType}
                    />
                </Layer>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        menu: state.MENU,
        selectedType: state.SELECTED_TYPE
    };
};

export default connect(mapStateToProps, null)(MapContainer);
