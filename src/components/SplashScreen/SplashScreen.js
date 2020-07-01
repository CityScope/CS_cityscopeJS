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

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(2),
    },

    root: {
        maxWidth: "50%",
        "& > *": {
            margin: theme.spacing(1),
        },

        textAlign: "center",
        rounded: true,
        maxHeight: "50%",
        paddingTop: 65,
        margin: "auto",
    },

    inputRoot: {
        fontSize: 60,
    },
    labelRoot: {
        fontSize: 50,
        color: "white",
        "&$labelFocused": {
            fontSize: 10,
            color: "white",
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
            <Typography variant="h1" gutterBottom>
                CityScopeJS
            </Typography>
            <Typography gutterBottom>
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
                    label="CityScope Project..."
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
            <div>
                <Fab
                    color="default"
                    href="https://cityscope.media.mit.edu/CS_cityscopeJS/?editor"
                >
                    <EditIcon />
                </Fab>
            </div>

            <div className={classes.caption}>
                <Typography variant="caption" gutterBottom>
                    Click here to design and deploy a new CityScope project
                    using Grid Editor
                </Typography>
            </div>

            <Box p={2} />
            <div>
                <Fab
                    href="http://github.com/CityScope/CS_cityscopeJS/"
                    color="default"
                >
                    <GitHubIcon />
                </Fab>
            </div>
            <div className={classes.caption}>
                <Typography variant="caption" gutterBottom>
                    This open-source project is developed by the CityScope
                    Network. Join us!
                </Typography>
            </div>
            <Box p={5} />
        </div>
    );
}
