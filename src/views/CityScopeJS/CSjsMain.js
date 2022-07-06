import MenuContainer from "./MenuContainer";
import DeckGLMap from "./DeckglMap";
import { useSelector } from "react-redux";
import VisContainer from "./VisContainer";

export default function CSjsMain() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      {cityIOisDone && (
        <>
          <MenuContainer />
          {/* <DeckGLMap /> */}
          {/* <VisContainer /> */}
        </>
      )}
    </>
  );
}
