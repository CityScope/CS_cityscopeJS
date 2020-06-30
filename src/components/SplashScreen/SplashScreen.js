import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import Button from "@material-ui/core/Button";
import GridOnIcon from "@material-ui/icons/GridOn";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
        padding: theme.spacing(5),

        maxWidth: "50%",
    },

    paper: {
        "& > *": {
            margin: theme.spacing(1),
            width: theme.spacing(20),
            height: theme.spacing(30),
        },
    },
}));

export default function SplashScreen() {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <Typography variant="h1" gutterBottom>
                    CityScopeJS
                </Typography>
                <Typography variant="h5" gutterBottom>
                    CityScopeJS is a unified front-end for MIT CityScope
                    project, an open-source urban modeling and simulation
                    platform. CityScopeJS allows users to examine different
                    urban-design alternatives, and observe their impact through
                    multiple layers of urban analytics modules, such as economy,
                    traffic and ABM simulation, urban access, storm-water, noise
                    and more.
                </Typography>
                <Box p={5} />

                <div className={classes.paper}>
                    <Button
                        variant="outlined"
                        color="default"
                        href="https://cityscope.media.mit.edu/CS_cityscopeJS/?editor"
                    >
                        <Box justifyContent="center">
                            <div>
                                <GridOnIcon />
                            </div>

                            <Typography variant="caption" gutterBottom>
                                Click here to design and deploy a new CityScope
                                project using Grid Editor
                            </Typography>
                        </Box>
                    </Button>

                    <Button
                        variant="outlined"
                        href="https://cityscope.media.mit.edu/CS_cityscopeJS/?editor"
                        color="default"
                    >
                        <Box justifyContent="center">
                            <div>
                                <GitHubIcon />
                            </div>
                            <Typography variant="caption" gutterBottom>
                                This open-source project is developed by the
                                CityScope Network. Join us!
                            </Typography>
                        </Box>
                    </Button>
                </div>
            </div>
        </>
    );
}
