import { List, ListItem, Card, CardContent, Grid, Box } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";

function VisContainer() {
  return (
    <ResizableDrawer direction="right" width={300}>
      <Box sx={{ margin: 1 }}>
        <Grid container spacing={1}  direction={"row"}>
          <Grid item xs={12} xl={8}>
            <Card variant="outlined" sx={{ width: "100%" }}>
              <CardContent>
                <RadarChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} xl={4}>
            <Card variant="outlined" sx={{ width: "100%" }}>
              <CardContent>
                <AreaCalc />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} xl={4}>
            <Card variant="outlined" sx={{ width: "100%" }}>
              <CardContent>
                <BarChart />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ResizableDrawer>
  );
}

export default VisContainer;
