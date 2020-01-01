import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/paper";
import RangeSlider from "./RangeSlider";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 5),
        position: "fixed",
        bottom: "2vw",
        left: "2vw",
        width: "90vw"
    }
}));

export default function PaperSheet() {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <RangeSlider />
        </Paper>
    );
}
