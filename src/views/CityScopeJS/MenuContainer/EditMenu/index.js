import { Button, Typography } from "@mui/material";
import { updateEditMenuState } from "../../../../redux/reducers/menuSlice";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function EditMenu() {
  const dispatch = useDispatch();
  const [editMenu, setEditMenu] = useState({ EDIT_BUTTON: false });

  // controls the menu state for the edit button
  const handleEditButtonClicks = (event) => {
    setEditMenu({
      ...editMenu,
      [event.currentTarget.id]: !editMenu[event.currentTarget.id],
    });
  };

  // dispatch the edit menu state to the redux store
  dispatch(updateEditMenuState(editMenu));

  return (
    <Button
      id={"EDIT_BUTTON"}
      variant="outlined"
      endIcon={editMenu.EDIT_BUTTON ? <CloudUploadIcon /> : <EditIcon />}
      onClick={(e) => handleEditButtonClicks(e)}
    >
      <Typography>
        {editMenu.EDIT_BUTTON ? "submit edits" : "start editing"}
      </Typography>
    </Button>
  );
}


