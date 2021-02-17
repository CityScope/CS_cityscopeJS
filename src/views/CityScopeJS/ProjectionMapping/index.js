import React, { Component } from "react";
import BaseMap from "../DeckglMap";
import { connect } from "react-redux";
import { ProjectionMapping } from "./ProjectionMapping";

class MapContainer extends Component {
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
                    isEditMode={true}
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
