import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer/MenuContainer";
import MapContainer from "./DeckglMap";
import VisContainer from "./VisContainer/VisContainer";
import LoadingSpinner from "./CityIO/LoadingSpinner";
import {
    Box,
    Container,
    Typography,
    makeStyles,
    Grid,
    Card,
    CardContent,
} from "@material-ui/core";
import Page from "../../layouts/Page";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
        height: "100%",
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
}));

export default function CityScopeJS() {
    const classes = useStyles();

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
        <Page className={classes.root} title="CitySCopeJS">
            {!tableName && (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    height="100%"
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
                    <Grid container spacing={3}>
                        <Grid item xs={12} l={4} md={4} xl={4} container>
                            <Grid item container direction="column" spacing={2}>
                                <Grid item xs={12} l={12} md={12} xl={12}>
                                    <Card elevation={15}>
                                        <CardContent>
                                            <Typography
                                                color="textPrimary"
                                                variant="h6"
                                            >
                                                Menu
                                            </Typography>
                                            <MenuContainer
                                                tableName={tableName}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} l={8} md={8} xl={8} >
                            <Card elevation={15}>
                                <MapContainer />
                            </Card>
                        </Grid>
                    </Grid>

                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </Page>
    );
}
