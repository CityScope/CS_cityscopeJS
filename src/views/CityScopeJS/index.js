import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer/MenuContainer";
import MapContainer from "./BaseMap";
import VisContainer from "./VisContainer/VisContainer";
import LoadingSpinner from "./CityIO/LoadingSpinner";
import { Box, Container, Typography } from "@material-ui/core";

export default function CityScopeJS() {
    // get the table name for cityIO comp
    const [tableName, setTableName] = useState(null);
    // on init, get the adress URL
    // to search for  a table
    useEffect(() => {
        let url = window.location.toString();
        let pre = "cityscope=";
        let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);
        // check URL for proper CS project link
        if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
            setTableName(cityscopePrjName);
        }
    }, []);

    // wait for 'ready' flag from cityIO when app is ready to start
    const ready = useSelector((state) => state.READY);

    return (
        <>
            {!ready && (
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    justifyContent="center"
                >
                    <Container maxWidth="sm">
                        <Typography
                            align="center"
                            color="textPrimary"
                            variant="h1"
                        >
                            CityScopeJS
                        </Typography>
                        <Typography
                            align="center"
                            color="textPrimary"
                            variant="h5"
                        >
                            Enter your CityScopeJS project name in the search
                            bar:
                        </Typography>
                        <Typography
                            align="center"
                            variant="h5"
                            color="textSecondary"
                        >
                            (this page URL)/csjs?cityscope=projectName
                        </Typography>
                    </Container>
                </Box>
            )}

            {tableName && <CityIO tableName={tableName} />}
            {ready && (
                <>
                    <MenuContainer tableName={tableName} />
                    <MapContainer />
                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </>
    );
}
