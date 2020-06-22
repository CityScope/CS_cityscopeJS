import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
        maxWidth: "50%",
    },

    inputRoot: {
        fontSize: 40,
    },
    labelRoot: {
        fontSize: 30,
        color: "white",
        "&$labelFocused": {
            color: "white",
        },
    },
    labelFocused: {
        fontSize: 15,
    },
}));

export default function SplashScreen() {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <Typography variant="h2" gutterBottom>
                    CityScopeJS
                </Typography>

                <div>
                    <Link href="https://github.com/CityScope/CS_cityscopeJS">
                        {""}
                        <Button color="default">
                            <GitHubIcon />
                        </Button>
                    </Link>
                </div>

                <Typography variant="h5" gutterBottom>
                    CityScopeJS is a unified front-end for MIT CityScope
                    project, an open-source urban modeling and simulation
                    platform. CityScopeJS allows users to examine different
                    urban-design alternatives, and observe their impact through
                    multiple layers of urban analytics modules, such as economy,
                    traffic and ABM simulation, urban access, storm-water, noise
                    and more.
                </Typography>
            </div>
        </>
    );
}
