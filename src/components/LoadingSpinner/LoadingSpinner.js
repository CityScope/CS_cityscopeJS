import React, { Component } from "react";
import { css } from "@emotion/core";
import { connect } from "react-redux";

import PulseLoader from "react-spinners/PulseLoader";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: none;
`;

class LoadingSpinner extends Component {
    render() {
        return (
            <div
                style={{
                    position: "absolute",
                    bottom: 50,
                    right: 50,
                    zIndex: 1
                }}
            >
                <PulseLoader
                    css={override}
                    size={20}
                    color={"white"}
                    loading={this.props.loading}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.LOADING
    };
};

export default connect(mapStateToProps, null)(LoadingSpinner);
