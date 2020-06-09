import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1),
    },
}));

export default function AreaCalc() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {"This div's text looks like that of a button."}
        </div>
    );
}
