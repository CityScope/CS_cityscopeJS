import { List, ListItem } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";

import EditMenu from "./EditMenu";

function MenuContainer() {
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
          <ViewSettingsMenu />
        </ListItem>
      </List>
    </>
  );
}

export default MenuContainer;
