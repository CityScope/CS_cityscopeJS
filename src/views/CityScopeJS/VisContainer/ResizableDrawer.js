import { useState, useCallback } from "react";
import { Drawer, Box, Button } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Avatar from "@mui/material/Avatar";

export const defaultDrawerWidth = 200;
const minDrawerWidth = 100;
const maxDrawerWidth =
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) -
  10;

export default function ResizableDrawer({ children }) {
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
    const newWidth =
      document.body.offsetLeft + document.body.offsetWidth - e.clientX + 20;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  return (
    <Drawer
      anchor={"right"}
      open={true}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{ style: { width: drawerWidth } }}
    >
      <Box
        onMouseDown={(e) => handleMouseDown(e)}
        sx={{
          width: "3px",
          padding: "4px 0 0",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          cursor: "ew-resize",
          backgroundColor: "gray",
        }}
      >
        <Button
          size="small"
          sx={{
            cursor: "ew-resize",
            position: "relative",
            top: "50%",
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <Avatar >
            <CompareArrowsIcon />
          </Avatar>
        </Button>
      </Box>
      {children}
    </Drawer>
  );
}
