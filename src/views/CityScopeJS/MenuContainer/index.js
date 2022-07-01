import { List, ListItem } from "@mui/material";
import { useState } from "react";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import VisibilityMenu from "./VisibilityMenu";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMenuState,
  toggleMenuIsPopulated,
} from "../../../redux/reducers/menuSlice";

import EditMenu from "./EditMenu";

function MenuContainer() {
  const [localMenuState, setLocalMenuState] = useState({ EDIT_BUTTON: false });

  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  // get local states from sub-components (TypesMenu, LayersMenu, VisibilityMenu)
  // const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({});
  // const [layersMenu, getLayersMenu] = useState({});
  // const [visibiltyMenu, getVisibilityMenu] = useState({});

  // useEffect(() => {
  //   setLocalMenuState({
  //     ...localMenuState,
  //     SELECTED_TYPE: selectedTypeFromMenu,
  //     LAYERS_MENU: layersMenu,
  //     VISIBILTY_MENU: visibiltyMenu,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedTypeFromMenu, layersMenu, visibiltyMenu]);

  // flag when the menu is populated with data from the server (cityIOdata) and is ready to be used
  dispatch(toggleMenuIsPopulated(true));

  return (
    <>
      <List>
        <ListItem>
          <EditMenu />
        </ListItem>
        <TypesMenu />
        <ListItem>
          <LayersMenu />
        </ListItem>
        <ListItem>
          {/* <VisibilityMenu getVisibilityMenu={getVisibilityMenu} /> */}
        </ListItem>
      </List>
    </>
  );
}

export default MenuContainer;
