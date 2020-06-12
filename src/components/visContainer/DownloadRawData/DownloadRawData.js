import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { CSVLink } from "react-csv";

/*
const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
];
*/

// global var to trigger the d/l
let csvLinkRefernce;

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

// simulate click event
const downloadCSV = () => {
    csvLinkRefernce.link.click();
};

const handleData = (props) => {
    let data = JSON.stringify(props);
    return data;
};

export default function DownloadRawData(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* ref the CSV comp */}
            <CSVLink
                ref={(r) => (csvLinkRefernce = r)}
                data={handleData(props)}
            ></CSVLink>

            <Button
                onClick={() => {
                    downloadCSV();
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
