import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import RangeSlider from "./RangeSlider";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 5),
        position: "absolute",
        bottom: "25%",
        left: "6.3vw",
        width: "220px"
    }
}));

export default function ABMSubmenu() {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <RangeSlider />
        </Paper>
    );
}
