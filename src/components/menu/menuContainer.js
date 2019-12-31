import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "./menu";
import PaperSheet from "./PaperSheet";

class MenuContainer extends Component {
    render() {
        if (this.props.cityioData && this.props.cityioData.grid) {
            return (
                <React.Fragment>
                    <Menu />
                    <PaperSheet />
                </React.Fragment>
            );
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
