import { useLayoutEffect, useState } from "react";
import { Typography, Slider, Checkbox, List, ListItem } from "@mui/material";
import { viewControlCheckboxes } from "../../../../settings/settings";
import { updateViewSettingsMenuState } from "../../../../redux/reducers/menuSlice";
import { useDispatch } from "react-redux";

function AnimationSubmenu() {
  const dispatch = useDispatch();

  const [viewSettingsMenuState, setViewSettingsMenuState] = useState(() => {
    let initState = {};
    for (const menuItem in viewControlCheckboxes) {
      initState[menuItem] = {
        isOn: viewControlCheckboxes[menuItem].initState,
        slider:
          viewControlCheckboxes[menuItem].initSliderValue &&
          viewControlCheckboxes[menuItem].initSliderValue,
      };
    }
    return initState;
  });

  // return the menu state to parent component
  useLayoutEffect(() => {
    //  dispatch this menu state to the redux store
    dispatch(updateViewSettingsMenuState(viewSettingsMenuState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSettingsMenuState]);

  const [sliderVal, setSliderVal] = useState({});
  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val });

    setViewSettingsMenuState({
      ...viewSettingsMenuState,
      [menuItem]: {
        ...viewSettingsMenuState[menuItem],
        slider: val,
      },
    });
  };

  const createCheckboxes = (menuItemList) => {
    const toggleListArr = [];
    for (const menuItem in menuItemList) {
      // check if we add slider to this menuItem
      const hasSlider = menuItemList[menuItem].initSliderValue;

      toggleListArr.push(
        <div key={"viewSettingDiv_" + menuItem}>
          <ListItem key={"viewSettingListItem_" + menuItem}>
            <Checkbox
              key={"viewSettingCheckBox_" + menuItem}
              checked={
                viewSettingsMenuState[menuItem] &&
                viewSettingsMenuState[menuItem].isOn
              }
              name={menuItem}
              onChange={(e) =>
                setViewSettingsMenuState({
                  ...viewSettingsMenuState,
                  [menuItem]: {
                    ...viewSettingsMenuState[menuItem],
                    isOn: e.target.checked,
                  },
                })
              }
            />

            <Typography
              variant={"caption"}
              key={"viewSettingCaption_" + menuItem}
            >
              {menuItemList[menuItem].displayName}
            </Typography>
          </ListItem>
          {hasSlider &&
            viewSettingsMenuState[menuItem] &&
            viewSettingsMenuState[menuItem].isOn && (
              <ListItem key={"viewSettingListItemSlider_" + menuItem}>
                <Slider
                  size="small"
                  key={"viewSettingSlider_" + menuItem}
                  valueLabelDisplay="auto"
                  onChangeCommitted={(_, val) => updateSliderVal(menuItem, val)}
                />
              </ListItem>
            )}
        </div>
      );
    }
    return toggleListArr;
  };

  return <List>{createCheckboxes(viewControlCheckboxes)}</List>;
}

export default AnimationSubmenu;
