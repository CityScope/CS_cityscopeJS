import { Typography, Link, Card, CardContent } from "@mui/material";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function SelectedTable(props) {
  const clicked = props.clicked;
  const cityscopeJSendpoint =
    // "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=";

    "http://localhost:3000/CS_cityscopeJS/?cityscope=";

  const [open, setOpen] = React.useState();

  // open dialog when table info has been changed
  React.useEffect(() => {
    setOpen(true);
  }, [clicked]);

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
        CityScope {clicked.object.tableName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="table-select-dialog-description">
          <Typography>
            <Link
              href={
                cityscopeJSendpoint + clicked.object.tableName.toLowerCase()
              }
            >
              Go to project
            </Link>{" "}
            or{" "}
            <Link target={"blank"} href={clicked.object.tableURL}>
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
