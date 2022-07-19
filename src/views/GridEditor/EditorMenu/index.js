// // export default EditMenuMain;

import GridPropsMenu from "./GridPropsMenu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ResizableDrawer from "../../../Components/ResizableDrawer";

// import TypesEditor from './TypesEditor'
// import GridMaker from "./GridMaker";
// import CommitGrid from "./CommitGrid";

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
      </List>
      <GridPropsMenu />

      {/* <TypesEditor /> */}
      {/* <GridMaker gridProps={formValues} /> */}
      {/* <CommitGrid gridProps={formValues} /> */}
    </ResizableDrawer>
  );
}
