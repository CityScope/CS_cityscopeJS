import { useState, useCallback } from "react";
import { Drawer, Box } from "@mui/material";
import Paper from "@mui/material/Paper";

const dividerWidth = 20;
const maxDrawerWidth =
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) -
  10;
const minDrawerWidth = 5;

export default function ResizableDrawer({ children, direction, width }) {
  const [drawerWidth, setDrawerWidth] = useState(
    width ||
      // 50% of the screen width
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      ) / 2
  );

  const handleMouseDown = (e) => {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    let newWidth = null;

    if (direction === "right") {
      newWidth =
        document.body.offsetLeft + document.body.offsetWidth - e.clientX + 20;
    } else if (direction === "left" || direction === undefined) {
      newWidth = document.body.offsetLeft + e.clientX + 20;
    } else if (direction === "bottom") {
      newWidth = document.documentElement.scrollHeight - e.clientY;
    }
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
    if (newWidth > document.documentElement.scrollHeight - dividerWidth) {
      setDrawerWidth(document.documentElement.scrollHeight - dividerWidth - 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        onMouseDown={(e) => handleMouseDown(e)}
        sx={{
          padding: dividerWidth + "px 0 0",
          position: "fixed",
          width: () => {
            if (
              direction === "right" ||
              direction === "left" ||
              direction === undefined
            ) {
              return `${dividerWidth}px`;
            } else if (direction === "bottom") {
              return "100vw";
            }
          },
          height: direction === "bottom" ? `${dividerWidth}px` : "100vh",
          left: direction === "left" ? drawerWidth + "px" : undefined,
          right: direction === "right" ? drawerWidth + "px" : undefined,
          bottom: direction === "bottom" ? drawerWidth + "px" : undefined,
          zIndex: direction === "bottom" ? 9999 : 100,
          cursor: "move",
          // color
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      />

      {/* only show handles in left/right cases  */}
      {(direction === "right" ||
        direction === "left" ||
        direction === undefined) && (
        <Box
          onMouseDown={(e) => handleMouseDown(e)}
          // on mobile devices we need to use onTouchStart instead of onMouseDown
          onTouchStart={(e) => handleMouseDown(e)}
          onClick={(e) =>
            drawerWidth < 30
              ? setDrawerWidth(maxDrawerWidth / 2)
              : setDrawerWidth(15)
          }
          sx={{
            position: "fixed",
            top: "45%",
            width: dividerWidth + 5,
            height: "10vh",
            left: direction === "left" ? drawerWidth + "px" : undefined,
            right: direction === "right" ? drawerWidth + "px" : undefined,
            zIndex: 1000,
            borderRadius: "30px",
            cursor: "move",
          }}
        >
          <Box
            sx={{
              transform: "rotate(90deg)",
              position: "absolute",
              top: "40%",
              left: "40%",
            }}
          >
            ...
          </Box>
        </Box>
      )}
      <Drawer
        anchor={direction}
        open={true}
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={
          direction === "bottom"
            ? { style: { height: drawerWidth, zIndex: 9999 } }
            : { style: { width: drawerWidth, zIndex: 100 } }
        }
      >
        <Paper>{children}</Paper>
      </Drawer>
    </>
  );
}
