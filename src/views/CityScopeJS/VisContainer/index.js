import { Grid, Box } from "@mui/material";
import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDrawer from "../../../Components/ResizableDrawer";
import CollapsableCard from "../../../Components/CollapsableCard";

function VisContainer() {
  return (
    <>
      <ResizableDrawer direction="right" width={window.innerWidth / 3}>
        <Box p={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <CollapsableCard
                collapse={true}
                variant="outlined"
                title="Radar Chart"
                subheader="Metrics and KPIs"
              >
                <RadarChart />
              </CollapsableCard>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <CollapsableCard
                collapse={true}
                variant="outlined"
                title="Land-use"
                subheader="Land-uses Area"
                toolTipInfo="Land use distribution and area. Each cell is calculated for
                its area (square meter ^ 2 per cell) times its floors (4.5
                meters per floor)"
              >
                <AreaCalc />
              </CollapsableCard>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <CollapsableCard
                collapse={true}
                variant="outlined"
                title="Bar Chart"
                subheader="Metrics and KPIs"
              >
                <BarChart />
              </CollapsableCard>
            </Grid>
          </Grid>
        </Box>
      </ResizableDrawer>
    </>
  );
}

export default VisContainer;
