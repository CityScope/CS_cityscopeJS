import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer";
import MapContainer from "./DeckglMap";
import LoadingSpinner from "./CityIO/LoadingSpinner";
import MissingTableInfo from "../Errors/MissingTableInfo";
import VisContainer from "./VisContainer";
import TableNameInput from "../../Components/TableNameInput";

import {
    makeStyles,
    Grid,
    Card,
    CardContent,
    Container,
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
    const [selectedTable, setSelectedTable] = useState(null);

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

    useEffect(() => {
        console.log(selectedTable);
        if (selectedTable) {
            let url = window.location.toString();
            window.location.replace(url + "?cityscope=" + selectedTable);
        }
    }, [selectedTable]);

    // wait for 'ready' flag from cityIO when app is ready to start
    const isReady = useSelector((state) => state.READY);
    const cityIOdata = useSelector((state) => state.CITYIO);

    return (
        <Page className={classes.root} title="CitySCopeJS">
            <Container maxWidth={null}>
                {!isReady && (
                    <>
                        <Container maxWidth="md">
                            <MissingTableInfo />
                            <TableNameInput
                                setSelectedTable={setSelectedTable}
                            />
                        </Container>
                    </>
                )}

                {tableName && <CityIO tableName={tableName} />}
                {isReady && (
                    <>
                        <Grid container spacing={5}>
                            <Grid item xs={6} l={3} md={3} xl={2} container>
                                <Grid
                                    item
                                    container
                                    direction="column"
                                    spacing={2}
                                >
                                    <Grid item xs={12} l={12} md={12} xl={12}>
                                        <Card
                                            elevation={15}
                                            style={{
                                                // allow scrolling
                                                maxHeight: "85vh",
                                                overflow: "auto",
                                            }}
                                        >
                                            <CardContent>
                                                <MenuContainer
                                                    tableName={tableName}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} l={6} md={6} xl={8}>
                                <Card
                                    elevation={15}
                                    style={{
                                        height: "85vh",
                                        width: "100%",
                                        position: "relative",
                                    }}
                                >
                                    <MapContainer />
                                </Card>
                            </Grid>

                            <Grid item xs={6} l={3} md={3} xl={2}>
                                <Card
                                    elevation={15}
                                    style={{
                                        maxHeight: "85vh",
                                        overflow: "auto",
                                    }}
                                >
                                    <VisContainer cityIOdata={cityIOdata} />
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                <LoadingSpinner />
            </Container>
        </Page>
    );
}
