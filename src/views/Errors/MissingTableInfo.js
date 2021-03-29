import React from "react";

import { Box, Container, Typography } from "@material-ui/core";

const MissingTableInfo = () => {
    return (
        <Container maxWidth="md">
            <Box mt={"3em"} />
            <Typography color="textPrimary" variant="h1">
                CityScopeJS
            </Typography>
            <Box mt={"3em"} />
            <Typography color="textPrimary" variant="h5">
                Enter your CityScopeJS project name in the search bar:
            </Typography>
            <Typography variant="h5" color="textSecondary">
                (this page URL)/CS_CityScopeJS/?cityscope=projectName
            </Typography>
            <Box mt={"3em"} />
        </Container>
    );
};

export default MissingTableInfo;
