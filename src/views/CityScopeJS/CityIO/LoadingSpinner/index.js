import React from "react";
import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import Typography from "@material-ui/core/Typography";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: none;
`;

function LoadingSpinner() {
    const [loadingModules] = useSelector((state) => [state.LOADING_MODULES]);
    return (
        <div
            style={{
                position: "fixed",
                bottom: 50,
                right: "50%",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
            }}
        >
            {loadingModules.map((module) => {
                return (
                    <div
                        key={module}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "3px",
                            marginTop: "3px",
                        }}
                    >
                        <Typography style={{ marginRight: "10px" }}>
                            loading {module}
                        </Typography>
                        <PulseLoader
                            css={override}
                            size={20}
                            color="white"
                            loading={true}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default LoadingSpinner;
