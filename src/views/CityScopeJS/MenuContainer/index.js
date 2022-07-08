import { List, ListItem } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import Box from "@mui/material/Box";
import ResizableDrawer from "../../../Components/ResizableDrawer";

import EditMenu from "./EditMenu";

function MenuContainer() {
  return (
    <ResizableDrawer direction="left">
      <List>
        <ListItem>
          <EditMenu />
        </ListItem>
        <TypesMenu />
        <ListItem>
          <LayersMenu />
        </ListItem>
        <ListItem>
          <ScenariosMenu />
        </ListItem>
        <ListItem>
          <ViewSettingsMenu />
        </ListItem>
      </List>
    </ResizableDrawer>
  );
}

export default MenuContainer;
