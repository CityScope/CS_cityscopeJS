import { Typography, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const LoadingProgressBar = ({ loadingModules, barHeight }) => {
  const barHeightPx = barHeight ? barHeight : 2;
  return (
    <>
      {loadingModules.map((module, index) => {
        const thisBarPosition = 10 + index * barHeightPx * 10;

        return (
          <Box
            key={"box_" + module}
            sx={{
              bottom: `${thisBarPosition}px`,
              width: "15vw",
              zIndex: 999,
              position: "fixed",
              left: "1vw",
            }}
          >
            <Typography
              variant="caption"
              color="secondary"
              style={{ marginRight: "1vw" }}
            >
              {module}...
            </Typography>
            <LinearProgress sx={{ height: barHeightPx }} color={"secondary"} />
          </Box>
        );
      })}
    </>
  );
};

export default LoadingProgressBar;
