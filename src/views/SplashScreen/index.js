import React from "react";
import {
    Container,
    Divider,
    Typography,
    makeStyles,
    Box,
    Grid,
} from "@material-ui/core";
import Page from "../../layouts/Page";
import GitHubIcon from "@material-ui/icons/GitHub";
import Fab from "@material-ui/core/Fab";
import GetGITdate from "./GetGITdate";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
        height: "100%",
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
    },
    gridCell: { textAlign: "center" },
    divider: {
        margin: theme.spacing(3),
    },
}));
export default function SplashScreen() {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Home">
            <Container maxWidth="sm" className={classes.content}>
                <Typography color="textPrimary" variant="h1">
                    CityScopeJS
                </Typography>
                <Divider className={classes.divider} light />

                <Typography color="textPrimary" variant="h3">
                    CityScopeJS is a unified front-end for MIT CityScope
                    project, an open-source urban modeling and simulation
                    platform. CityScopeJS allows users to examine different
                    urban-design alternatives, and observe their impact through
                    multiple layers of urban analytics modules, such as economy,
                    traffic and ABM simulation, urban access, storm-water, noise
                    and more.
                </Typography>
                <Divider className={classes.divider} light />
                <Grid container spacing={2}>
                    <Grid item xs={12} l={6} md={6} xl={6}>
                        <Typography
                            color="textPrimary"
                            variant="h6"
                            gutterBottom
                        >
                            CityScopeJS is an open-source project, developed by
                            MIT, the CityScope Network, and contributers from
                            all over the world. Join us!
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        l={6}
                        md={6}
                        xl={6}
                        className={classes.gridCell}
                    >
                        <Fab
                            href="http://github.com/CityScope/CS_cityscopeJS/"
                            color="default"
                        >
                            <GitHubIcon />
                        </Fab>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} light />
                <Box flex={1}>
                    <GetGITdate />
                </Box>
            </Container>
        </Page>
    );
}
