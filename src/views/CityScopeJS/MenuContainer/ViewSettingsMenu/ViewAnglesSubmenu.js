import { useLayoutEffect, useState } from "react";
import { ButtonGroup, Button, List } from "@mui/material";
import { viewControlButtons } from "../../../../settings/settings";
import { updateViewSettingsMenuState } from "../../../../redux/reducers/menuSlice";
import { useDispatch } from "react-redux";

function ViewAnglesSubmenu() {
  const dispatch = useDispatch();

  const [viewSettingsMenuState, setViewSettingsMenuState] = useState();

  // return the menu state to parent component
  useLayoutEffect(() => {
    //  dispatch this menu state to the redux store
    dispatch(updateViewSettingsMenuState(viewSettingsMenuState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSettingsMenuState]);

  const handleButtonClicks = (thisButton) => {
    setViewSettingsMenuState({
      ...viewSettingsMenuState,
      VIEW_CONTROL_BUTTONS: thisButton,
    });
  };

  // create a button group for the view control buttons
  const createViewControlButtons = (viewControlButtons) => {
    const buttonsArr = [];
    for (const thisButton in viewControlButtons) {
      buttonsArr.push(
        <Button
          key={Math.random()}
          size="small"
          onClick={() => handleButtonClicks(thisButton)}
        >
          {viewControlButtons[thisButton].displayName}
        </Button>
      );
    }
    return (
      <ButtonGroup fullWidth sx={{ width: "100%" }} color="primary">
        {buttonsArr}
      </ButtonGroup>
    );
  };

  return <List>{createViewControlButtons(viewControlButtons)}</List>;
}

export default ViewAnglesSubmenu;
