import { Grid, Box } from "@mui/material";
import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import EditMenu from "./EditMenu";
import TableInfo from "./TableInfo";
import SpecialLayersControlsMenu from "./SpecialLayersControlsMenu/";
import CollapsableCard from "../../../Components/CollapsableCard";

function MenuContainer() {
  const menuItemsArray = [
    {
      component: <TableInfo />,
      collapse: true,
    },

    {
      component: (
        <>
          <EditMenu />
          <TypesMenu />
        </>
      ),
      collapse: false,
      title: "Edit Mode",
      subheader: "Toggle Edit Mode & Select Types",
    },
    {
      component: <ScenariosMenu />,
      collapse: false,
      title: "Scenarios",
      subheader: "Save and Load Scenarios",
    },
    {
      component: (
        <>
          <LayersMenu />
          <SpecialLayersControlsMenu />
        </>
      ),
      collapse: true,
      title: "Layers",
      subheader: "Layers visibility",
    },

    {
      component: <ViewSettingsMenu />,
      collapse: false,
      title: "View Settings",
      subheader: "Toggle different visibility settings",
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
