import { List, ListItem } from "@mui/material";
import RadarChart from "./RadarChart";
// import BarChart from "./BarChart";
// import AreaCalc from "./AreaCalc";
import ResizableDrawer from "./ResizableDrawer";

function VisContainer() {
  return (
    <ResizableDrawer>
      <List>
        <ListItem>{/* <AreaCalc /> */}</ListItem>
        <ListItem>
          <RadarChart />
        </ListItem>
        <ListItem>{/* <BarChart /> */}</ListItem>
      </List>
    </ResizableDrawer>
  );
}

export default VisContainer;
