import MenuContainer from "./MenuContainer";
import DeckGLMap from "./DeckglMap";
import { useSelector } from "react-redux";

// import VisContainer from './VisContainer'

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { CardContent } from "@material-ui/core";

export default function CSjsMain() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      <CardContent>
        {cityIOisDone && (
          <>
            <Drawer
              anchor={"left"}
              open={true}
              variant="persistent"
              ModalProps={{
                keepMounted: true,
              }}
            >
              <Box
                sx={{
                  width: 300,
                }}
              >
                <MenuContainer />
              </Box>
            </Drawer>
          </>
        )}
      </CardContent>

      <DeckGLMap />
      {/* <VisContainer  /> */}
    </>
  );
}
