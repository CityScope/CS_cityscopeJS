import React from "react";
import { useSelector } from "react-redux";
import settings from "../../../../../settings/settings.json";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { errorStyle } from "../../../../../services/consoleStyle";

export default function SaveAsScenario() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const cityioData = useSelector(state => state.CITYIO);

    const postMapToMockAPI = () => {
        const data = { ...cityioData, name };

        const postURL = settings.cityIO.mockURL + "/scenarios";

        const options = {
            method: "post",
            url: postURL,
            data,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        };
        axios(options).catch(error => {
            console.log("%c" + error, errorStyle);

            console.log("ERROR:", error);
        });
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                Save As Scenario
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Save As Scenario
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Name:</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        fullWidth
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            postMapToMockAPI();
                            handleClose();
                        }}
                        color="primary"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
