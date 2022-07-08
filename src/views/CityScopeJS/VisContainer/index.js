import { List, ListItem } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";

function VisContainer() {
  return (
    <ResizableDrawer direction="right">
      <List>
        <ListItem>
          <AreaCalc />
        </ListItem>
        <ListItem>
          <RadarChart />
        </ListItem>

        <ListItem>
          <BarChart />
        </ListItem>
      </List>
    </ResizableDrawer>
  );
}

export default VisContainer;
