import React, { Component } from "react";
import BaseMap from "./BaseMap";
import { connect } from "react-redux";

class MapContainer extends Component {
    _checkKeystone = () => {
        return this.props.menu.includes("KEYSTONE") ? true : false;
    };

    render() {
        return (
            <BaseMap
                menu={this.props.menu}
                selectedType={this.props.selectedType}
            />
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
