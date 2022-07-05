import { List, ListItem } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import EditMenu from "./EditMenu";

function MenuContainer() {
  return (
    <Drawer
      anchor={"left"}
      open={true}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box
        sx={{
          width: 300,
        }}
      >
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
      </Box>
    </Drawer>
  );
}

export default MenuContainer;
