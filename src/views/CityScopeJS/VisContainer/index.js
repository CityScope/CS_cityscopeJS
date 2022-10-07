import { Grid, Box } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import RenderedViewMap from "../../RenderedView/RenderedViewMap";
import CollapsableCard from "../../../Components/CollapsableCard";

function VisContainer() {
  return (
    <ResizableDrawer direction="right" width={window.innerWidth / 3}>
      <Box p={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <CollapsableCard
              variant="outlined"
              title="Radar Chart"
              subheader="Metrics and KPIs"
            >
              <RadarChart />
            </CollapsableCard>
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6}>
            <CollapsableCard
              variant="outlined"
              title="Land-use"
              subheader="Distribution of Land-uses"
            >
              <AreaCalc />
            </CollapsableCard>
          </Grid>
          <Grid item xs={12} md={12} lg={6} xl={6}>
            <CollapsableCard
              variant="outlined"
              title="Bar Chart"
              subheader="Metrics and KPIs"
            >
              <BarChart />
            </CollapsableCard>
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <CollapsableCard
              variant="outlined"
              title="DeepScope"
              subheader="Visualize the Design Space"
            >
              <RenderedViewMap />
            </CollapsableCard>
          </Grid>
        </Grid>
      </Box>
    </ResizableDrawer>
  );
}

export default VisContainer;
