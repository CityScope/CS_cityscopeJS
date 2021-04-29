import React from "react";
import { useSelector } from "react-redux";
import { Typography, Box } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";


const LoadingSpinner = () => {
    const [loadingModules] = useSelector((state) => [state.LOADING_MODULES]);

    return (
        <>
            {loadingModules.map((module, index) => {
                return (
                    <Box
                        position="fixed"
                        bottom={index * 50}
                        right="2vw"
                        width="10vw"
                        zIndex="101"
                        margin="0"
                        key={module}
                    >
                        <LinearProgress color={'secondary'} />
                        <Typography
                            variant="h6"
                            color="primary"
                            style={{ marginRight: "10px" }}
                        >
                            {module}
                        </Typography>
                    </Box>
                );
            })}
        </>
    );
};

export default LoadingSpinner;
