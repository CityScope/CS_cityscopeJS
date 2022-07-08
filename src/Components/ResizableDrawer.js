import { useState, useCallback } from "react";
import { Drawer, Box } from "@mui/material";

const dividerWidth = 4;
const maxDrawerWidth =
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) -
  1;

export const defaultDrawerWidth = Math.floor(maxDrawerWidth / 3);
const minDrawerWidth = 50;

export default function ResizableDrawer({ children, direction }) {
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  const handleMouseDown = (e) => {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e) => {
    let newWidth = null;

    if (direction === "right") {
      newWidth =
        document.body.offsetLeft + document.body.offsetWidth - e.clientX + 20;
    } else {
      newWidth = document.body.offsetLeft + e.clientX + 20;
    }
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  return (
    <Drawer
      onMouseDown={(e) => handleMouseDown(e)}
      anchor={direction}
      open={true}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
     
    >
      <Box
        onMouseDown={(e) => handleMouseDown(e)}
        sx={{
          height: "100%",
          width: `${dividerWidth}px`,
          padding: "4px 0 0",
          position: "absolute",
          top: 0,
          left: direction === "left" ? { drawerWidth } : undefined,
          right: direction === "right" ? undefined : "0",

          bottom: 0,
          zIndex: 1000,
          cursor: "ew-resize",
          backgroundColor: "gray",
        }}
      ></Box>
      {children}
    </Drawer>
  );
}
