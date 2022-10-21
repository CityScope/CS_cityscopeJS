import { testHex, hexToRgb } from "../../utils/utils";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Typography, Box } from "@mui/material";

/**
 * cell selection
 * meta div
 * @param {*} props
 */

export const PaintBrush = (props) => {
  if (!props.mousePos || !props.hoveredCells) return null;
  const selectedType = props.selectedType;
  const isInteractiveCell = props.hoveredCells.object.properties.interactive;
  const mousePos = props.mousePos;
  const divSize = props.divSize;
  let col = selectedType.color;
  if (testHex(col)) {
    col = hexToRgb(col);
  }
  const color = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
  const colorTrans = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.6)";
  let mouseX = mousePos.clientX - divSize / 2;
  let mouseY = mousePos.clientY - divSize / 2;
  return (
    <>
      <Box
        sx={{
          border: isInteractiveCell ? "3px solid" : "1px dashed",
          borderRadius: "5%",
          position: "fixed",
          backgroundColor:
            props.mouseDown && isInteractiveCell ? colorTrans : "rgba(0,0,0,0)",
          padding: "1vw",
          color: color,
          borderColor: color,
          zIndex: 10,
          pointerEvents: "none",
          width: divSize,
          height: divSize,
          left: mouseX,
          top: mouseY,
        }}
      />

      <Box
        sx={{
          borderRadius: "5%",
          position: "fixed",
          left: mouseX + divSize + 10,
          top: mouseY - 10,
          display: "flex",
          flexDirection: "column",
          m: 1,
          p: 1,
          pointerEvents: "none",
          zIndex: 10,
          color: color,
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <Typography variant="caption">
          {isInteractiveCell && <strong>{selectedType.thisTypeName}</strong>}
        </Typography>
        {!isInteractiveCell && (
          <>
            <ErrorOutlineIcon sx={{ color: color }} />
            <Typography variant="caption">
              <strong>{selectedType.thisTypeName}</strong>
            </Typography>
            <Typography variant="caption">
              Cell {props.hoveredCells.object.properties.id} is not interactive
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};
