import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import GetGITdate from "./GetGITdate";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(2),
    },
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
        textAlign: "center",
        rounded: true,
        paddingTop: 100,
        margin: "auto",
        padding: 2,
        maxWidth: 600,
    },

    flex: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-evenly",
    },

    inputRoot: {
        fontSize: 60,
        width: 300,
    },
    labelRoot: {
        fontSize: 20,
        color: "white",
        "&$labelFocused": {
            color: "white",
            fontSize: 10,
        },
    },
    labelFocused: { color: "white" },
    caption: { margin: "auto", maxWidth: "30%" },
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
        <div className={classes.root}>
            <Typography variant="h3" gutterBottom>
                CityScopeJS
            </Typography>
            <Box p={2} />

            <Typography variant="h6" gutterBottom>
                CityScopeJS is a unified front-end for MIT CityScope project, an
                open-source urban modeling and simulation platform. CityScopeJS
                allows users to examine different urban-design alternatives, and
                observe their impact through multiple layers of urban analytics
                modules, such as economy, traffic and ABM simulation, urban
                access, storm-water, noise and more.
            </Typography>
            <Box p={5} />

            <div>
                <TextField
                    autoComplete="off"
                    onChange={(event) => handleTextFieldChange(event)}
                    InputProps={{ classes: { root: classes.inputRoot } }}
                    InputLabelProps={{
                        classes: {
                            root: classes.labelRoot,
                            focused: classes.labelFocused,
                        },
                    }}
                    id="outlined-basic"
                    label="Type CityScope Project Name..."
                ></TextField>
                <div>
                    {textFieldContent && (
                        <Button
                            onClick={() => {
                                loadCityScopeJSproject();
                            }}
                            variant="outlined"
                            className={classes.button}
                        >
                            <SendIcon />
                            Load CityScope Project
                        </Button>
                    )}
                </div>
            </div>

            <Box p={5} />
            <div className={classes.flex}>
                <Fab
                    color="default"
                    href="https://cityscope.media.mit.edu/CS_cityscopeJS/?editor"
                >
                    <EditIcon />
                </Fab>

                <div className={classes.caption}>
                    <Typography variant="caption" gutterBottom>
                        Click here to design and deploy a new CityScope project
                        using Grid Editor
                    </Typography>
                </div>

                <Box p={2} />
                <Fab
                    href="http://github.com/CityScope/CS_cityscopeJS/"
                    color="default"
                >
                    <GitHubIcon />
                </Fab>

                <div className={classes.caption}>
                    <Typography variant="caption" gutterBottom>
                        This open-source project is developed by the CityScope
                        Network. Join us!
                    </Typography>
                </div>
            </div>
            <Box p={5} />

            <GetGITdate />
            <Box p={5} />
        </div>
    );
}
