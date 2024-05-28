import { Typography, Box } from "@mui/material";
import { testHex, hexToRgb } from "../../utils/utils";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 *
 * Cell meta comp
 */

export const CellMeta = (props) => {
  if (!props.mousePos) return null;
  const mousePos = props.mousePos;
  const hoveredObj = props.hoveredObj;

  let col = hoveredObj.object.properties.color;
  if (testHex(col)) {
    col = hexToRgb(col);
  }
  const color = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";

  return (
    <Box
      sx={{
        borderRadius: "5%",
        position: "fixed",
        // color from theme palette
        padding: "0.25vw",

        zIndex: 10,
        left: mousePos.clientX + 10,
        top: mousePos.clientY + 10,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: color,
        // if object.properties.interactive is true, border is 3px solid, else 1px dashed
        border: hoveredObj.object.properties.interactive
          ? "3px solid"
          : "1px dashed",
        // keep the box the same size even if the text is longer
        minWidth: "100px",
        minHeight: "50px",
      }}
    >
      <Typography>{hoveredObj.object.properties.name}</Typography>
      <Typography variant="caption">
        height: {hoveredObj.object.properties.height}
      </Typography>
      <Typography variant="caption">
        ID: {hoveredObj.object.properties.id}
      </Typography>
      {!hoveredObj.object.properties.interactive && (
        <div style={{ display: "flex", alignItems: "left" }}>
          <ErrorOutlineIcon
            sx={{
              color: color,
              fontSize: "1rem",
            }}
          />
          <Typography variant="caption">Non-interactive</Typography>
        </div>
      )}
    </Box>
  );
};
