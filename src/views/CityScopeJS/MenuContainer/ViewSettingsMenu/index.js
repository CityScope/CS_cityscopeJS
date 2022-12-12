import { List } from "@mui/material";
// import AnimationSubmenu from "./AnimationSubmenu";
import ViewAnglesSubmenu from "./ViewAnglesSubmenu";

function ViewSettingsMenu() {
  return (
    <List>
      <ViewAnglesSubmenu />
      {/* <AnimationSubmenu /> */}
    </List>
  );
}

export default ViewSettingsMenu;
