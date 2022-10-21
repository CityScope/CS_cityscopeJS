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
        backgroundColor: "rgba(0,0,0,0.85)",
        padding: "1vw",
        color: "rgba(255,255,255,0.9)",
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
        Height: {hoveredObj.object.properties.height}
      </Typography>
      <Typography variant="caption">
        ID: {hoveredObj.object.properties.id}
      </Typography>
    </Box>
  );
};
