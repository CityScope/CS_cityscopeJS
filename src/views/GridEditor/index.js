// import EditorMap from "./EditorMap/EditorMap";
import EditorMenu from "./EditorMenu";
import { Grid } from "@mui/material";

export default function GridEditor() {
  return (
    <>
      <Grid container>
        <Grid item xs={12} l={6} md={6} xl={4}>
          <EditorMenu />
        </Grid>
        <Grid item xs={12} l={6} md={6} xl={8}>
          {/* <EditorMap /> */}
        </Grid>
      </Grid>
    </>
  );
}
