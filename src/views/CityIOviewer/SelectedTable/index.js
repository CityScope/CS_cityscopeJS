import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {generalSettings} from "../../../settings/settings";
import CloseIcon from '@mui/icons-material/Close';

export default function SelectedTable(props) {
  const selectedTable = props.clicked;

  const cityscopeJSendpoint = generalSettings.csjsURL + "?cityscope=";
  const projectionEndpoint = generalSettings.csjsURL + "?projection=";

  const [open, setOpen] = useState(false);

  // open dialog when table info has been changed
  useEffect(() => {
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="table-select-dialog-title"
      aria-describedby="table-select-dialog-description"
      sx={{
        background: "rgba(0, 0, 0, 0.5)",
        "& .MuiPaper-root": {
          background: "rgba(0, 0, 0, .8)",
          outline: "1px solid white",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent", // Try to remove this to see the result
        },
      }}
    >
      <DialogTitle id="table-select-dialog-title" variant="h4">
        CityScope {selectedTable.tableName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="table-select-dialog-description">
          <Typography component={"span"}>
          <Button variant="contained" href={cityscopeJSendpoint + selectedTable.tableName.toLowerCase()} 
              sx={{padding: 1, marginTop: 1, marginLeft: 2}}>Go to project</Button>

            <Button variant="outlined" href={projectionEndpoint + selectedTable.tableName.toLowerCase()}
              sx={{padding: 1, marginTop: 1, marginLeft: 2}}>project this table to TUI</Button>

            <Button variant="outlined" href={selectedTable.tableURL}
              sx={{padding: 1, marginTop: 1, marginLeft: 2}}>view raw data on cityIO</Button>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined"><CloseIcon/> Close</Button>
      </DialogActions>
    </Dialog>
  );
}
