import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "./menu";

class MenuContainer extends Component {
    render() {
        if (this.props.ready) {
            return <Menu />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => {
    return {
        ready: state.READY
    };
};

export default connect(mapStateToProps, null)(MenuContainer);
