import React, { useState } from "react";
import {
    Grid,
    Container,
    Typography,
    makeStyles,
    Button,
} from "@material-ui/core";
import Page from "../../layouts/Page";
import GitHubIcon from "@material-ui/icons/GitHub";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import Fab from "@material-ui/core/Fab";
import GetGITdate from "./GetGITdate";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
}));
export default function SplashScreen() {
    const [textFieldContent, setTextFieldContent] = useState(null);

    const handleTextFieldChange = (e) => {
        const { value } = e.target;
        setTextFieldContent(value);
    };

    const loadCityScopeJSproject = () => {
        let url =
            "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=" +
            textFieldContent;
        window.location.href = url;
    };

    const classes = useStyles();

    return (
        <Page className={classes.root} title="Home">
            <Container maxWidth={false}>
                <Grid container spacing={3}>
                    <Grid item lg={12} sm={12} xl={12} xs={12}>
                        <Typography color="textPrimary" variant="h1">
                            CityScopeJS
                        </Typography>
                    </Grid>
                    <Grid item lg={8} sm={8} xl={8} xs={8}>
                        <Typography
                            variant="h6"
                            color="textPrimary"
                            gutterBottom
                        >
                            CityScopeJS is a unified front-end for MIT CityScope
                            project, an open-source urban modeling and
                            simulation platform. CityScopeJS allows users to
                            examine different urban-design alternatives, and
                            observe their impact through multiple layers of
                            urban analytics modules, such as economy, traffic
                            and ABM simulation, urban access, storm-water, noise
                            and more.
                        </Typography>
                    </Grid>
                    <Grid item lg={12} sm={12} xl={12} xs={12}>
                        <TextField
                            autoComplete="off"
                            onChange={(event) => handleTextFieldChange(event)}
                            label="CityScope Project..."
                        ></TextField>

                        {textFieldContent && (
                            <Button
                                onClick={() => {
                                    loadCityScopeJSproject();
                                }}
                                variant="outlined"
                            >
                                <SendIcon />
                                Load CityScope Project
                            </Button>
                        )}
                    </Grid>

                    <Grid item lg={12} sm={12} xl={12} xs={12}>
                        <Grid item lg={3} sm={3} xl={3} xs={3}>
                            <Fab
                                href="http://github.com/CityScope/CS_cityscopeJS/"
                                color="default"
                            >
                                <GitHubIcon />
                            </Fab>
                        </Grid>
                        <Grid item lg={6} sm={6} xl={6} xs={6}>
                            <Typography
                                color="textPrimary"
                                variant="caption"
                                gutterBottom
                            >
                                This open-source project is developed by the
                                CityScope Network. Join us!
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item lg={8} sm={8} xl={8} xs={8}>
                        <GetGITdate />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
