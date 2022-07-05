import React from "react";
import { List, ListItem, Drawer, Box } from "@mui/material";
import Radar from "./Radar";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";

function VisContainer() {
  return (
    <Drawer
      anchor={"right"}
      open={true}
      variant="persistent"
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box
        sx={{
          width: 200,
        }}
      >
        <List>
          <ListItem>
            {/* <AreaCalc /> */}
          </ListItem>
          <ListItem>
            {/* <Radar /> */}
          </ListItem>
          <ListItem>
            {/* <BarChart /> */}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default VisContainer;
