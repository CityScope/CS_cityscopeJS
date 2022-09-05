import { Card, CardContent, Grid, Box } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";

function VisContainer() {
  return (
    <ResizableDrawer direction="right" width={400}>
      <Box sx={{ margin: 1 }}>
        <Grid container spacing={1} direction={"row"}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Card variant="outlined">
              <CardContent>
                <RadarChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6}>
            <Card variant="outlined">
              <CardContent>
                <AreaCalc />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6}>
            <Card variant="outlined">
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
