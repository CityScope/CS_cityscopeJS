import { List, ListItem } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import Grid from "@mui/material/Grid";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import EditMenu from "./EditMenu";
import TableInfo from "./TableInfo";
import AnimationMenu from "./AnimationMenu"; 


function MenuContainer() {
  return (
    <ResizableDrawer direction="left">
      <Grid container>
        <Grid item xs={12}>
          <List>
          <ListItem>
              <TableInfo />
            </ListItem>
            <ListItem>
              <EditMenu />
            </ListItem>
            <TypesMenu />
            <ListItem>
              <ScenariosMenu />
            </ListItem>
            <ListItem>
              <LayersMenu />
            </ListItem>
            <ListItem>
              <ViewSettingsMenu />
            </ListItem>
            <ListItem>
              <AnimationMenu />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </ResizableDrawer>
  );
}

export default MenuContainer;
