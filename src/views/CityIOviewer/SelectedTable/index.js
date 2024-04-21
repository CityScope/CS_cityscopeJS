import { Typography, Link } from "@mui/material";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { generalSettings } from "../../../settings/settings";

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
      <DialogContent>
        <DialogContentText id="table-select-dialog-description">
          <Typography id="table-select-dialog-title" variant="h2">
            {selectedTable.tableName}
          </Typography>
          <Typography>
            <Link
              href={cityscopeJSendpoint + selectedTable.tableName.toLowerCase()}
            >
              Go to project
            </Link>
            {", "}
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
    </Dialog>
  );
}
