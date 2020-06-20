import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        margin: "auto",
        padding: theme.spacing(2),
        width: "100%",
        maxWidth: 500,
    },
    paper: {
        padding: theme.spacing(2),
        margin: "auto",
        maxWidth: 500,
    },
}));

export default function SplashScreen() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                    CityScopeJS
                </Typography>

                <Typography variant="body2" gutterBottom>
                    CityScopeJS is a unified front-end for the MIT CityScope
                    project, an open-source urban modeling and simulation
                    platform. CityScopeJS allows users to test different design
                    alternatives and observe their impact through multiple
                    layers of urban analytics. CityScopeJS combines different
                    urban analytics modules, such as traffic simulation, ABM,
                    noise, storm-water, access.
                </Typography>

                <Link href="https://github.com/CityScope/CS_cityscopeJS">
                    <Button color="default">
                        <GitHubIcon />
                    </Button>
                </Link>
            </Paper>
        </div>
    );
}
