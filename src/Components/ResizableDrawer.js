import { useState, useCallback } from "react";
import { Drawer, Box } from "@mui/material";

const dividerWidth = 5;
const maxDrawerWidth =
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) -
  1;

export const defaultDrawerWidth = Math.floor(maxDrawerWidth / 4);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        onMouseDown={(e) => handleMouseDown(e)}
        sx={{
          width: `${dividerWidth}px`,
          padding: dividerWidth + "px 0 0",
          position: "fixed",
          height: "1000vh",
          left:
            direction === "left"
              ? drawerWidth + "px"
              : undefined,
          right: direction === "right" ? drawerWidth + "px" : undefined,
          zIndex: 10000,
          cursor: "ew-resize",
          backgroundColor: "gray",
        }}
      />
      <Drawer
        anchor={direction}
        open={true}
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{ style: { width: drawerWidth } }}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        {children}
      </Drawer>
    </>
  );
}
