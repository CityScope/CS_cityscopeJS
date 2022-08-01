import { List, ListItem, Card, CardContent } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";

function VisContainer() {
  return (
    <ResizableDrawer direction="right" width={200}>
      {/*  */}
      <List>
        <ListItem>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
              <AreaCalc />
            </CardContent>
          </Card>
        </ListItem>
        {/*  */}
        <ListItem>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
              <RadarChart />
            </CardContent>
          </Card>
        </ListItem>
        {/*  */}
        <ListItem>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
              <BarChart />
            </CardContent>
          </Card>
        </ListItem>
      </List>
    </ResizableDrawer>
  );
}

export default VisContainer;
