import { Typography, Box } from "@mui/material";

/**
 *
 * Cell meta comp
 */

export const CellMeta = (props) => {
  if (!props.mousePos) return null;
  const mousePos = props.mousePos;
  const hoveredObj = props.hoveredObj;

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
        left: mousePos.clientX,
        top: mousePos.clientY,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <Typography>{hoveredObj.object.properties.name}</Typography>
      <Typography variant="caption">
        Value: {hoveredObj.object.properties.height}
      </Typography>
      <Typography variant="caption">
        ID: {hoveredObj.object.properties.id}
      </Typography>
    </Box>
  );
};
