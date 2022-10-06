import { Typography, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const LoadingModules = (props) => {
  const { loadingModules, verticalPosition, barHeight, noFixed } = props;
  return (
    <>
      {loadingModules.map((module, index) => {
        return (
          <Box
            key={"box_" + module}
            sx={{
              position: noFixed ? "absolute" : "fixed",
              bottom: verticalPosition === "bottom" ? (index + 1) * 10 : "auto",
              width: noFixed ? "90%" : "100%",
              zIndex: 10000,
            }}
          >
            <LinearProgress
              sx={{ height: barHeight || 10 }}
              color={"secondary"}
            />
            <Typography
              variant="caption"
              color="primary"
              style={{ marginRight: "1vw" }}
            >
              Loading {module}
            </Typography>
          </Box>
        );
      })}
    </>
  );
};

export default LoadingModules;
