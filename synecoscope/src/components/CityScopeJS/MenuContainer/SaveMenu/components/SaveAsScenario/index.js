import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingState } from "../../../../../../redux/actions";
import settings from "../../../../../../settings/settings.json";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";

export default function SaveAsScenario(props) {
    const maxNumOfScenarios = 10;
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const dispatch = useDispatch();
    const { tableName, toggleDrawer } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const useStyles = makeStyles((theme) => ({
        button: {
            margin: theme.spacing(1),
        },
    }));

    const classes = useStyles();

    const cityioData = useSelector((state) => state.CITYIO);
    const scenarioNames = useSelector((state) => state.SCENARIO_NAMES);

    const getScenarioIndex = () => {
        var getURL = settings.cityIO.baseURL + tableName + "/meta/hashes";
        const options = {
            method: "get",
            url: getURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        axios(options)
            .then((res) => {
                const metaDataKeys = Object.keys(res.data);
                const scenarioIndices = metaDataKeys
                    .filter((str) => str.includes("scenarios"))
                    .map((str) => parseInt(str.replace("scenarios", "")));
                console.log("successfully got scenarios");
                const newScenarioIndex = scenarioIndices.length
                    ? Math.max(...scenarioIndices) + 1
                    : 0;
                postScenario(newScenarioIndex);
            })
            .catch((err) => {
                console.log("Error getting scenarios", err);
            });
    };

    const postScenario = (id) => {
        const data = {
            GEOGRIDDATA: cityioData.GEOGRIDDATA,
            info: {
                id,
                name,
            },
        };

        var postURL =
            settings.cityIO.baseURL + "update/" + tableName + "/scenarios" + id;

        const options = {
            method: "post",
            url: postURL,
            data,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        axios(options)
            .then((res) => {
                console.log("Successfully saved grid data and network");
                dispatch(setLoadingState(false));
                toggleDrawer();
                handleClose();
            })
            .catch((error) => {
                console.log("%c" + error);
                console.log("ERROR:", error);
                handleClose();
            });
    };

    return (
        <div style={{ marginLeft: 12 }}>
            <Button
                disabled={scenarioNames.length >= maxNumOfScenarios}
                variant="outlined"
                color="default"
                onClick={handleClickOpen}
                className={classes.button}
                startIcon={<CloudUploadIcon />}
            >
                Save Scenario
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Save Scenario</DialogTitle>
                <DialogContent>
                    <DialogContentText>Name:</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(setLoadingState(true));
                            getScenarioIndex();
                        }}
                        color="default"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
