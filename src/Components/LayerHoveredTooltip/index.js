import { Typography, Box } from "@mui/material";

export const LayerHoveredTooltip = (props) => {
  if (!props.mousePos) return null;
  const mousePos = props.mousePos;
  const layerHoveredData = props.layerHoveredData;

  return (
    <Box
      sx={{
        borderRadius: "5%",
        position: "fixed",
        // color from theme palette
        backgroundColor: "primary.opacityDarkBackground",
        padding: "1vw",
        color: "primary.main",
        zIndex: 10,
        left: mousePos.clientX - 100,
        top: mousePos.clientY ,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <Typography variant="caption">
        {layerHoveredData && layerHoveredData}
      </Typography>
    </Box>
  );
};
