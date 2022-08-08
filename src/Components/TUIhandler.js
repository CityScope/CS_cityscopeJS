import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateLayersMenuState } from "../redux/reducers/menuSlice";

// description:
//   - this component handles the TUI menu
//   - it is a stateful redux component that updates the state of 
//     the layers menu when the TUI is updated

const TUIhandler = () => {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const tuiMenuControl = cityIOdata.tui;
  const menuState = useSelector((state) => state.menuState);
  const layersMenuState = menuState.layersMenuState;

  useEffect(
    () => {
      if (!tuiMenuControl) return;
      for (const menuItem in tuiMenuControl) {
        dispatch(
          updateLayersMenuState({
            ...layersMenuState,
            [menuItem]: {
              ...layersMenuState[menuItem],
              isOn: tuiMenuControl[menuItem],
            },
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuiMenuControl]
  );

  return <></>;
};

export default TUIhandler;
