import { Grid, Box } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import EditMenu from "./EditMenu";
import TableInfo from "./TableInfo";
import SpecialLayersControlsMenu from "./SpecialLayersControlsMenu";
import CollapsableCard from "../../../Components/CollapsableCard";

function MenuContainer() {
  const menuItemsArray = [
    {
      component: <TableInfo />,
      collapse: true,
    },
    {
      component: <EditMenu />,
      collapse: false,
      title: "Edit",
      subheader: "Toggle Edit Mode",
    },
    {
      component: <TypesMenu />,
      collapse: false,
      title: "Types",
      subheader: "List of Types and their Properties",
    },
    {
      component: <ScenariosMenu />,
      collapse: false,
      title: "Scenarios",
      subheader: "Scenarios",
    },
    {
      component: <LayersMenu />,
      collapse: false,
      title: "Layers",
      subheader: "Layers",
    },
    {
      component: <SpecialLayersControlsMenu />,
      collapse: true,
      title: "Layers Control",
      subheader: "Special Layers controls",
    },
    {
      component: <ViewSettingsMenu />,
      collapse: false,
      title: "View Settings",
      subheader: "View Settings",
    },
  ];

  const MenuItems = () => {
    const m = [];

    menuItemsArray.forEach((item, index) => {
      m.push(
        <Grid item xs={12} md={12} lg={12} xl={12} key={item.title + "_grid"}>
          <CollapsableCard
            variant="outlined"
            title={item.title}
            subheader={item.subheader}
            collapse={item.collapse}
          >
            {item.component}
          </CollapsableCard>
        </Grid>
      );
    });
    return m;
  };

  return (
    <ResizableDrawer direction="left" width={300}>
      <Box p={1}>
        <Grid container>
          <MenuItems />
        </Grid>
      </Box>
    </ResizableDrawer>
  );
}

export default MenuContainer;
