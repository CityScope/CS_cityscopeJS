import {
  List,
  Grid,
  ListItem,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import GridPropsMenu from "./GridPropsMenu";
import GridMakerMenu from "./GridMakerMenu";
import TypesEditorMenu from "./TypesEditorMenu";
import CommitGridMenu from "./CommitGridMenu";

export default function EditorMenu() {
  const menuItemsArray = [
    <Typography variant="h2">CityScope Grid Editor</Typography>,
    <Typography>
      This editor can create and `commit` spatial layouts (`grids`) as a
      baseline for CityScope projects. Use the menus and map to edit girds,
      types, and props, and commit them to cityIO.
    </Typography>,
    <GridPropsMenu />,
    <Grid container spacing={2}>
      <Grid item>
        <GridMakerMenu />
      </Grid>
      <Grid item>
        <CommitGridMenu />
      </Grid>
      <Grid item>
        <TypesEditorMenu />
      </Grid>
    </Grid>,
  ];

  const MenuItems = () => {
    const m = [];

    menuItemsArray.forEach((item, index) => {
      m.push(
        <ListItem key={index}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>{item}</CardContent>
          </Card>
        </ListItem>
      );
    });
    return m;
  };

  return (
    <ResizableDrawer direction={"left"} width={500}>
      <List>
        <MenuItems />
      </List>
    </ResizableDrawer>
  );
}
