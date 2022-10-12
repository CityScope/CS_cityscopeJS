import { useSelector } from "react-redux";
import RenderedViewMap from "./RenderedViewMap";
import ResizableDrawer from "../../Components/ResizableDrawer";
import { Grid } from "@mui/material";

export default function RenderedView() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      <ResizableDrawer direction="bottom" width={50}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            {cityIOisDone && <RenderedViewMap />}
          </Grid>
        </Grid>
      </ResizableDrawer>
    </>
  );
}
