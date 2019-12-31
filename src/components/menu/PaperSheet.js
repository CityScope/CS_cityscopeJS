import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/paper";
import Typography from "@material-ui/core/typography";
import RangeSlider from "./RangeSlider";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(5, 5),
        zIndex: 2,
        position: "fixed",
        bottom: "2em",
        left: "2em"
    }
}));

export default function PaperSheet() {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Typography variant="h4" component="h3">
                Info
            </Typography>
            <Typography component="p">information</Typography>
            <RangeSlider />
        </Paper>
    );
}
