import { useSelector } from "react-redux";
import RenderedViewMap from "./RenderedViewMap";
import ResizableDrawer from "../../Components/ResizableDrawer";
import { Grid, Box, Container } from "@mui/material";
import CollapsableCard from "../../Components/CollapsableCard";

export default function RenderedView() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      <ResizableDrawer direction="bottom" width={50}>
      <Container maxWidth="xl">
        <Box p={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12} xl={12}>
              <CollapsableCard
                collapse={true}
                variant="outlined"
                title="DeepScope"
                subheader="Render the design space"
              >
                {cityIOisDone && <RenderedViewMap />}
              </CollapsableCard>
            </Grid>
          </Grid>

        </Box>
        </Container>
      </ResizableDrawer>
    </>
  );
}
