import React, { Component } from "react";
import MAP from "./baseMap";
import { connect } from "react-redux";
import { Layer } from "../prjMap/layer";

class MapContainer extends Component {
    _checkKeystone = () => {
        return this.props.menu.includes("KS") ? true : false;
    };

    render() {
        if (
            this.props &&
            this.props.cityioData &&
            this.props.cityioData.header
        ) {
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
                            cityioData={this.props.cityioData}
                            menu={this.props.menu}
                            selectedType={this.props.selectedType}
                        />
                    </Layer>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU,
        selectedType: state.SELECTED_TYPE
    };
};

export default connect(mapStateToProps, null)(MapContainer);
