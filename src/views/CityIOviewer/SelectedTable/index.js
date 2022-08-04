import { Typography, Link } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function SelectedTable(props) {
  const selectedTable = props.clicked;
  console.log(selectedTable);
  const cityscopeJSendpoint =
    // "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=";

    "http://localhost:3000/CS_cityscopeJS/?cityscope=";

  const projectionEndpoint =
    "http://localhost:3000/CS_cityscopeJS/?projection=";

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
    >
      <DialogTitle id="table-select-dialog-title">
        CityScope {selectedTable.tableName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="table-select-dialog-description">
          <Typography component={"span"}>
            <Link
              href={cityscopeJSendpoint + selectedTable.tableName.toLowerCase()}
            >
              Go to project
            </Link>{", "}
            <Link
              href={projectionEndpoint + selectedTable.tableName.toLowerCase()}
            >
              project this table to TUI
            </Link>{" "}
            or{" "}
            <Link target={"blank"} href={selectedTable.tableURL}>
              view raw data on cityIO.
            </Link>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>(x) Close</Button>
      </DialogActions>
    </Dialog>
  );
}
