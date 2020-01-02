import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/paper";
import RangeSlider from "./RangeSlider";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1, 5),
        position: "fixed",
        bottom: "3vw",
        left: "3vw",
        width: "20vw"
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
