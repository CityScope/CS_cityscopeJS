import GridPropsMenu from "./GridPropsMenu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ResizableDrawer from "../../../Components/ResizableDrawer";

import GridMakerMenu from "./GridMakerMenu";
// import TypesEditor from './TypesEditor'
// import CommitGrid from "./CommitGridMenu";

export default function EditorMenu() {
  return (
    <ResizableDrawer direction={"left"}>
      <List>
        <ListItem>
          <Typography variant="h2">CityScope Grid Editor</Typography>
        </ListItem>
        <ListItem>
          <Typography>
            This editor can create and `commit` spatial layouts (`grids`) as a
            baseline for CityScope projects. Use the menus and map to edit
            girds, types, and props, and commit them to cityIO.
          </Typography>
        </ListItem>
        <ListItem>
          <GridPropsMenu />
        </ListItem>
        <ListItem>
          <GridMakerMenu />
        </ListItem>
        {/* <TypesEditor /> */}
        {/* <CommitGrid  /> */}
      </List>
    </ResizableDrawer>
  );
}
