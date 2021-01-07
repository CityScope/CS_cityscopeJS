import React, { Component } from "react";
import BaseMap from "./BaseMap";
import { connect } from "react-redux";
import { ProjectionMapping } from "../ProjectionMapping/ProjectionMapping";

class MapContainer extends Component {
    _checkKeystone = () => {
        return this.props.menu.includes("KEYSTONE") ? true : false;
    };

    render() {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                <ProjectionMapping
                    style={{
                        height: "100vh",
                        width: "100vw",
                    }}
                    isEditMode={this._checkKeystone()}
                >
                    <BaseMap
                        menu={this.props.menu}
                        selectedType={this.props.selectedType}
                    />
                </ProjectionMapping>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.MENU,
        selectedType: state.SELECTED_TYPE,
    };
};

export default connect(mapStateToProps, null)(MapContainer);
