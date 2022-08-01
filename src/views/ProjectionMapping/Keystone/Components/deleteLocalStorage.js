import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteLocalStorage() {
  return (
    <Grid container alignItems="center" justify="center">
      <Button
        sx={{ zIndex: "tooltip", top: "50vh", left: "50vw" }}
        variant="contained"
        startIcon={<DeleteIcon />}
      >
        Reset Projection Mapping
      </Button>
    </Grid>
  );
}
