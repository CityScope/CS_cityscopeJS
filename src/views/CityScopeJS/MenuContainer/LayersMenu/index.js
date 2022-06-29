import {
  Slider,
  Checkbox,
  Typography,
  FormControlLabel,
  ListItem,
  List,
} from "@mui/material";

import { useLayoutEffect, useState } from "react";
import { expectedLayers } from "../../../../settings/menuSettings";

function LayersMenu(props) {
  const { getLayersMenu, cityIOdata } = props;

  /**
   * inital state
   */
  const [menuState, setMenuState] = useState(() => {
    let initState = {};
    for (const menuItem in expectedLayers) {
      initState[menuItem] = {
        isOn: expectedLayers[menuItem].initState,
        slider:
          expectedLayers[menuItem].hasSlider &&
          expectedLayers[menuItem].initSliderValue,
      };
    }
    return initState;
  });

  // return the manu state to parent component
  useLayoutEffect(() => {
    getLayersMenu(menuState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState]);

  const [sliderVal, setSliderVal] = useState(() => {
    let initState = {};
    for (const menuItem in expectedLayers) {
      initState[menuItem] =
        expectedLayers[menuItem].hasSlider &&
        expectedLayers[menuItem].initSliderValue;
    }
    return initState;
  });

  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val });
  };

  const createLayersControlList = (menuLayersList) => {
    const toggleListArr = [];
    for (const menuItem in menuLayersList) {
      //  get short module name for each toggle
      const moduleName = menuLayersList[menuItem].cityIOmoduleName;
      // check if we add slider to this menuItem
      const hasSlider = menuLayersList[menuItem].hasSlider;
      //  check if this toggle is a layer that requires cityIO
      if (moduleName in cityIOdata) {
        toggleListArr.push(
         
            <ListItem key={Math.random()}>
              <FormControlLabel
                key={Math.random()}
                control={
                  <Checkbox
                    checked={menuState[menuItem] && menuState[menuItem].isOn}
                    key={Math.random()}
                    color="primary"
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
                }
                label={
                  <Typography variant="caption" key={Math.random()}>
                    {menuLayersList[menuItem].displayName}
                  </Typography>
                }
              />

              {hasSlider && menuState[menuItem] && menuState[menuItem].isOn && (
                <Slider
                  key={Math.random()}
                  value={sliderVal && sliderVal[menuItem]}
                  defaultValue={100}
                  valueLabelDisplay="auto"
                  // ! pass both val and name of slider to keep it between updates
                  onChange={(e, val) => {
                    updateSliderVal(menuItem, val);
                    setMenuState({
                      ...menuState,
                      [menuItem]: {
                        ...menuState[menuItem],
                        slider: sliderVal[menuItem],
                      },
                    });
                  }}
                />
              )}
            </ListItem>
      
        );
      }
    }

    return toggleListArr;
  };

  return <List>{createLayersControlList(expectedLayers)}</List>;
}

export default LayersMenu;
