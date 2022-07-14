import { Typography } from "@mui/material";

/**
 *
 * Cell meta comp
 */

export const CellMeta = (props) => {
  if (!props.mousePos) return null;
  const mousePos = props.mousePos;

  return (
    <div
      style={{
        borderRadius: "10%",
        position: "fixed",
        pointerEvents: "none",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "1vw",
        color: "rgba(255,255,255,0.9)",
        zIndex: 10,
        left: mousePos.clientX,
        top: mousePos.clientY,
        //
      }}
    >
      <Typography>Type: {props.hoveredObj.object.properties.name}</Typography>
      <Typography>
        Height: {props.hoveredObj.object.properties.height}
      </Typography>
      <Typography>ID: s{props.hoveredObj.object.properties.id}</Typography>
    </div>
  );
};
