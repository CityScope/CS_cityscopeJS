import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "@emotion/core";
import React, { Component } from "react";

class LoadingVisualization extends Component {
    render = () => (
        <ScaleLoader
            css={css`
                position: fixed;
                bottom: 50%;
                left: 50%;
            `}
            sizeUnit={"px"}
            height={20}
            width={20}
            radius={2}
            color={"white"}
            loading={this.props.loading}
        />
    );
}

export default LoadingVisualization;
