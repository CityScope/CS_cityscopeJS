import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "./menu";

class MenuContainer extends Component {
    render() {
        if (this.props.cityioData && this.props.cityioData.grid) {
            return <Menu />;
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

export default connect(mapStateToProps, null)(MenuContainer);
