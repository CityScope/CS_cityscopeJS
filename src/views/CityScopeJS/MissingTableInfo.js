import React from "react";

import { Box, Container, Typography } from "@material-ui/core";

const MissingTableInfo = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
        >
            <Container maxWidth="sm">
                <Typography align="center" color="textPrimary" variant="h1">
                    CityScopeJS
                </Typography>
                <Typography align="center" color="textPrimary" variant="h5">
                    Enter your CityScopeJS project name in the search bar:
                </Typography>
                <Typography align="center" variant="h5" color="textSecondary">
                    (this page URL)/csjs?cityscope=projectName
                </Typography>
            </Container>
        </Box>
    );
};

export default MissingTableInfo;
