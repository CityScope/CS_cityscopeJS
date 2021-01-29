import React, { Component } from "react";
import { connect } from "react-redux";
import BaseMap from "./BaseMap.js";

class BaseMapContainer extends Component {
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
        selectedType: state.ROW_EDIT,
    };
};

export default connect(mapStateToProps, null)(BaseMapContainer);
