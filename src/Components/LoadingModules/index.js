import { Typography, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const LoadingModules = (props) => {
  const { loadingModules } = props;
  return (
    <>
      {loadingModules.map((module, index) => {
        return (
       
            <Box
              key={"box_"+module}
              sx={{
                position: "fixed",
                bottom: (index + 1) * 10,
                width: "100%",
                zIndex: 10000,
              }}
            >
              <LinearProgress color={"secondary"} />
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
