import { Button, Typography, List, ListItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useState } from "react";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import VisibilityMenu from "./VisibilityMenu";
import { useSelector, useDispatch } from "react-redux";
import { updateMenu } from "../../../redux/reducers/menuSlice";

function MenuContainer() {
  const cityIOdata = useSelector((state) => state.cityIOdataStore.cityIOdata);
  const menuState = useSelector((state) => state.menuStateStore.menuState);

  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({});
  const [layersMenu, getLayersMenu] = useState({});
  const [visibiltyMenu, getVisibiltyMenu] = useState({});

  useDispatch(
    updateMenu({
      ...menuState,
      SELECTED_TYPE: selectedTypeFromMenu,
      LAYERS_MENU: layersMenu,
      VISIBILTY_MENU: visibiltyMenu,
    }),
    [selectedTypeFromMenu, layersMenu, visibiltyMenu]
  );

  // controls the menu state for the edit button
  const handleEditButtonClicks = (event) => {
    // useDispatch(
    //   updateMenu({
    //     ...menuState,
    //     [event.currentTarget.id]: !menuState[event.currentTarget.id],
    //   })
    // );
  };

  return (
    <>
      {cityIOdata && (
        <List>
          <ListItem>
            <Typography variant={"h3"}>Edit</Typography>
          </ListItem>

          <ListItem>
            <Button
              id={"EDIT_BUTTON"}
              endIcon={
                menuState.EDIT_BUTTON ? <CloudUploadIcon /> : <EditIcon />
              }
              color="default"
              onClick={(e) => handleEditButtonClicks(e)}
            >
              <Typography variant={"h5"}>
                {menuState.EDIT_BUTTON ? "submit edits" : "start editing"}
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
      )}
    </>
  );
}

export default MenuContainer;
