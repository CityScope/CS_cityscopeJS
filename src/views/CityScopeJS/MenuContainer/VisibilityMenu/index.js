import {
  ButtonGroup,
  Button,
  Typography,
  Slider,
  Checkbox,
  List,
  ListItem,
} from "@mui/material";
import { useLayoutEffect, useState } from "react";
import {
  viewControlItems,
  viewControlButtons,
} from "../../../../settings/menuSettings";

function VisibilityMenu(props) {
  const { getVisibilityMenu } = props;
  const [menuState, setMenuState] = useState(() => {
    let initState = {};
    for (const menuItem in viewControlItems) {
      initState[menuItem] = {
        isOn: viewControlItems[menuItem].initState,
        slider:
          viewControlItems[menuItem].hasSlider &&
          viewControlItems[menuItem].initSliderValue,
      };
    }
    return initState;
  });

  // return the manu state to parent component
  useLayoutEffect(() => {
    getVisibilityMenu(menuState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState]);

  const [sliderVal, setSliderVal] = useState(0);

  const handleButtonClicks = (thisButton) => {
    setMenuState({
      ...menuState,
      VIEW_CONTROL_BUTTONS: thisButton,
    });
  };

  const createButtons = (viewControlButtons) => {
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
    return <ButtonGroup color="primary">{buttonsArr}</ButtonGroup>;
  };

  const createCheckboxes = (menuItemList) => {
    const toggleListArr = [];
    for (const menuItem in menuItemList) {
      // check if we add slider to this menuItem
      const hasSlider = menuItemList[menuItem].hasSlider;
      //  check if this toggle is a layer that requires cityIO
      // or it's visibility layer that we always show
      if (!menuItemList[menuItem].cityIOmoduleName) {
        toggleListArr.push(
          <div key={Math.random()}>
            <ListItem key={Math.random()}>
              <Checkbox
                key={Math.random()}
                checked={menuState[menuItem] && menuState[menuItem].isOn}
                name={menuItem}
                onChange={(e) =>
                  setMenuState({
                    ...menuState,
                    [menuItem]: {
                      ...menuState[menuItem],
                      isOn: e.target.checked,
                    },
                  })
                }
              />

              <Typography variant={"caption"} key={Math.random()}>
                {menuItemList[menuItem].displayName}
              </Typography>
            </ListItem>
            {hasSlider && menuState[menuItem] && menuState[menuItem].isOn && (
              <ListItem key={Math.random()}>
                <Slider
                  key={Math.random()}
                  value={sliderVal.value}
                  valueLabelDisplay="auto"
                  // ! pass both val and name of slider to keep it between updates
                  onChange={(e, val) => setSliderVal({ [menuItem]: val })}
                  onMouseUp={(e, val) =>
                    setMenuState({
                      ...menuState,
                      [menuItem]: {
                        ...menuState[menuItem],
                        slider: sliderVal[menuItem],
                      },
                    })
                  }
                />
              </ListItem>
            )}
          </div>
        );
      }
    }
    return toggleListArr;
  };

  return (
    <List>
      {createButtons(viewControlButtons)}
      {createCheckboxes(viewControlItems)}
    </List>
  );
}

export default VisibilityMenu;
