import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
        position: "fixed",
        top: "50vh",
        zIndex: 1000
    }
}));

export default function DeleteLocalStorage() {
    const classes = useStyles();

    return (
        <Grid container alignItems="center" justify="center">
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<DeleteIcon />}
            >
                Reset Projection Mapping
            </Button>
        </Grid>
    );
}
