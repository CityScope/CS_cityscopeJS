// // export default EditMenuMain;

// import TypesEditor from './TypesEditor'
// import GridProps from './GridProps'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

export default function EditorMenu() {
  return (
    <List>
      <ListItem>
        <Typography variant="h3">CityScope Grid Editor</Typography>
      </ListItem>
      <ListItem>
        <Typography>
          This editor can create and `commit` spatial layouts (`grids`) as a
          baseline for CityScope projects. Use the menus and map to edit girds,
          types, and props, and commit them to cityIO.
        </Typography>
      </ListItem>
      <ListItem>{/* <GridProps /> */}</ListItem>
      <ListItem>{/* <TypesEditor /> */}</ListItem>
    </List>
  );
}
