import { List, ListItem } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import Grid from "@mui/material/Grid";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import EditMenu from "./EditMenu";

function MenuContainer() {
  return (
    <ResizableDrawer direction="left">
      <Grid container>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </ResizableDrawer>
  );
}

export default MenuContainer;
