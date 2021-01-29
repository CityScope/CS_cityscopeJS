import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

const downloadTxtFile = (props) => {
    let data = JSON.stringify(props);
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "data.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
};

export default function DownloadRawData(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Button
                onClick={() => {
                    downloadTxtFile(props);
                }}
                size="small"
                variant="outlined"
                color="secondary"
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                {props.title}
            </Button>
        </div>
    );
}
