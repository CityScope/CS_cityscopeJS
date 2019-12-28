import React, { Component } from "react";
import { connect } from "react-redux";
import Radar from "./Radar/Radar";

class VisContainer extends Component {
    render() {
        if (
            this.props.menu &&
            this.props.menu.includes("RADAR") &&
            this.props.cityioData &&
            this.props.cityioData.grid
        ) {
            return <Radar cityioData={this.props.cityioData} />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU
    };
};

export default connect(mapStateToProps, null)(VisContainer);
