import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer/MenuContainer";
import MapContainer from "./DeckglMap";
import VisContainer from "./VisContainer/VisContainer";
import LoadingSpinner from "./CityIO/LoadingSpinner";
import MissingTableInfo from "./MissingTableInfo";
import { makeStyles, Grid, Card, CardContent , Container} from "@material-ui/core";
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
            {!tableName && <MissingTableInfo />}
            {tableName && <CityIO tableName={tableName} />}
            {ready && (
                <>
                    <Container maxWidth={false}>
                        <Grid container spacing={5}>
                            <Grid item xs={10} l={3} md={3} xl={3} container>
                                <Grid
                                    item
                                    container
                                    direction="column"
                                    spacing={2}
                                >
                                    <Grid item xs={12} l={12} md={12} xl={12}>
                                        <Card elevation={15}>
                                            <CardContent>
                                                <MenuContainer
                                                    tableName={tableName}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} l={9} md={9} xl={9}>
                                <Card elevation={15}>
                                    <MapContainer />
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </Page>
    );
}
