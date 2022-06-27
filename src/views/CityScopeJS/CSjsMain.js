import MenuContainer from "./MenuContainer";
import MapContainer from "./DeckglMap";
import { useSelector } from "react-redux";

// import VisContainer from './VisContainer'

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { CardContent } from "@material-ui/core";
import Page from "../../layouts/Page";

export default function CSjsMain() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  const menuIsPopulated = useSelector(
    (state) => state.menuState.menuIsPopulated
  );

  return (
    <Page title="CitySCopeJS">
      <CardContent>
        {cityIOisDone && (
          <>
            <Drawer
              anchor={"left"}
              open={"true"}
              // variant="temporary"
              variant="persistent"
              PaperProps={{
                sx: {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              <Box
                sx={{
                  width: 350,
                }}
              >
                <MenuContainer />
              </Box>
            </Drawer>
          </>
        )}
      </CardContent>

      {menuIsPopulated && (
        <>
          <MapContainer />;
        </>
      )}

      {/* <VisContainer cityIOdata={cityIOdata} /> */}
    </Page>
  );
}
