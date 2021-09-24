import { Button, Typography, List, ListItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useEffect, useState } from "react";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import VisibilityMenu from "./VisibilityMenu";
import { useSelector, useDispatch } from "react-redux";
import { updateMenuState, toggleMenuIsPopulated } from "../../../redux/reducers/menuSlice";

function MenuContainer() {
  const [localMenuState, setLocalMenuState] = useState({ EDIT_BUTTON: false });

  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  // get local states from sub-components (TypesMenu, LayersMenu, VisibilityMenu)
  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({});
  const [layersMenu, getLayersMenu] = useState({});
  const [visibiltyMenu, getVisibiltyMenu] = useState({});

  useEffect(() => {
    setLocalMenuState({
      ...localMenuState,
      SELECTED_TYPE: selectedTypeFromMenu,
      LAYERS_MENU: layersMenu,
      VISIBILTY_MENU: visibiltyMenu,
    });
  }, [selectedTypeFromMenu, layersMenu, visibiltyMenu]);

  // controls the menu state for the edit button
  const handleEditButtonClicks = (event) => {
    setLocalMenuState({
      ...localMenuState,
      [event.currentTarget.id]: !localMenuState[event.currentTarget.id],
    });
  };

  dispatch(updateMenuState(localMenuState));
  dispatch(toggleMenuIsPopulated(true));

  return (
    <>
      <List>
        <ListItem>
          <Typography variant={"h3"}>Edit</Typography>
        </ListItem>

        <ListItem>
          <Button
            id={"EDIT_BUTTON"}
            endIcon={
              localMenuState.EDIT_BUTTON ? <CloudUploadIcon /> : <EditIcon />
            }
            color="default"
            onClick={(e) => handleEditButtonClicks(e)}
          >
            <Typography variant={"h5"}>
              {localMenuState.EDIT_BUTTON ? "submit edits" : "start editing"}
            </Typography>
          </Button>
        </ListItem>

        <TypesMenu
          cityIOdata={cityIOdata}
          getSelectedTypeFromMenu={getSelectedTypeFromMenu}
        />

        <ListItem>
          <Typography variant={"h3"}>Layers</Typography>
        </ListItem>
        <LayersMenu cityIOdata={cityIOdata} getLayersMenu={getLayersMenu} />

        <ListItem>
          <Typography variant={"h3"}>Display</Typography>
        </ListItem>
        <VisibilityMenu getVisibiltyMenu={getVisibiltyMenu} />
      </List>
    </>
  );
}

export default MenuContainer;
