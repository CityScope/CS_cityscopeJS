import React, { Component } from "react";
import MAP from "./map";
import { connect } from "react-redux";

class MapContainer extends Component {
    render() {
        if (
            this.props &&
            this.props.cityioData &&
            this.props.cityioData.header
        ) {
            return <MAP cityioData={this.props.cityioData} />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        cityioData: state.CITYIO
    };
};

export default connect(mapStateToProps, null)(MapContainer);
