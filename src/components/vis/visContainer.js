import React, { Component } from "react";
import { connect } from "react-redux";
import Radar from "./Radar/Radar";

class VisContainer extends Component {
    render() {
        if (this.props.menu.includes("RADAR") && this.props.ready) {
            return <Radar cityioData={this.props.cityioData} />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU,
        ready: state.READY
    };
};

export default connect(mapStateToProps, null)(VisContainer);
