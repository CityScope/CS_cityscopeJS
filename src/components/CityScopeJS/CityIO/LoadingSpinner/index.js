import React from "react";
import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: none;
`;

function LoadingSpinner() {
    const loading = useSelector((state) => state.LOADING);
    return (
        <div
            style={{
                position: "fixed",
                bottom: 50,
                right: 50,
                zIndex: 1,
            }}
        >
            <PulseLoader
                css={override}
                size={20}
                color="white"
                loading={loading}
            />
        </div>
    );
}

export default LoadingSpinner;
