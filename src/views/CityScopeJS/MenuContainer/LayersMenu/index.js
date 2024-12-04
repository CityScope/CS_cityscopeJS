import {
  Slider,
  Checkbox,
  Typography,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { expectedLayers } from "../../../../settings/settings";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";

function LayersMenu() {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const layersMenuReduxState = useSelector(
    (state) => state.menuState.layersMenuState
  );

  // get the keys from cityIOdata
  const cityIOkeys = Object.keys(cityIOdata);

  // update the layer slider value
  const [sliderVal, setSliderVal] = useState(() => {
    const sv = {};
    for (const menuItem in expectedLayers) {
      sv[menuItem] = expectedLayers[menuItem].initSliderValue;
    }
    return sv;
  });

  // initial layer menu state
  let initState = {};
  const [layersMenuState, setLayersMenuState] = useState(() => {
    for (const menuItem in expectedLayers) {
      initState[menuItem] = {
        isOn: expectedLayers[menuItem].initState,
        slider: expectedLayers[menuItem].initSliderValue,
      };
    }
    return initState;
  });

  useEffect(() => {
    dispatch(updateLayersMenuState(layersMenuState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersMenuState]);

  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val });
  };

  const handleCheckboxEvent = (menuItem, e) => {
    setLayersMenuState({
      ...layersMenuReduxState,
      [menuItem]: {
        ...layersMenuReduxState[menuItem],
        isOn: e,
      },
    });
  };

  const commitSliderVal = (menuItem, val) => {
    setLayersMenuState({
      ...layersMenuReduxState,
      [menuItem]: {
        ...layersMenuReduxState[menuItem],
        slider: val,
      },
    });
  };

  const toggleListArr = [];
  const makeLayerControlsMenu = () => {
    // loop through the keys in cityIOdata and make a list of keys
    for (const menuItem in expectedLayers) {
      const moduleName = expectedLayers[menuItem].cityIOmoduleName;
      // if the module name is in the data for this CS instance, make a checkbox
      if (cityIOkeys.includes(moduleName)) {
        toggleListArr.push(
          <Box key={"box_" + menuItem}>
            <FormControlLabel
              key={"formControl_" + menuItem}
              control={
                <Checkbox
                  checked={
                    (layersMenuState[menuItem] &&
                      layersMenuState[menuItem].isOn) ||
                    false
                  }
                  key={"checkbox_" + menuItem}
                  color="primary"
                  onChange={(e) =>
                    handleCheckboxEvent(menuItem, e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="caption" key={"label_" + menuItem}>
                  {expectedLayers[menuItem].displayName}
                </Typography>
              }
            />

            {layersMenuState[menuItem] && layersMenuState[menuItem].isOn && (
              <Slider
                size="small"
                key={"slider_" + menuItem}
                valueLabelDisplay="auto"
                onChangeCommitted={(_, val) => commitSliderVal(menuItem, val)}
                onChange={(_, val) => updateSliderVal(menuItem, val)}
                value={sliderVal[menuItem] ?? 0}
              />
            )}
          </Box>
        );
      }
    }
    // loop through the keys in deckgl layers
    if(cityIOdata.layers)
      for (let i = 0; i < cityIOdata.layers.length; i++) {
        const moduleName = cityIOdata.layers[i].id;
        if(!layersMenuState[moduleName]){
          setLayersMenuState({...layersMenuState, [moduleName]: {
            isOn: true,
            slider: 50,
          }})
        }
        // if the module name is in the data for this CS instance, make a checkbox
        toggleListArr.push(
          <Box key={"box_" + moduleName}>
            <FormControlLabel
              key={"formControl_" + moduleName}
              control={
                <Checkbox
                  checked={
                    (layersMenuState[moduleName] &&
                      layersMenuState[moduleName].isOn) ||
                    false
                  }
                  key={"checkbox_" + moduleName}
                  color="primary"
                  onChange={(e) =>
                    handleCheckboxEvent(moduleName, e.target.checked)
                  }
                />
              }
              label={
                <Typography variant="caption" key={"label_" + moduleName}>
                  {moduleName}
                </Typography>
              }
            />

            {layersMenuState[moduleName] && layersMenuState[moduleName].isOn && (
              <Slider
                size="small"
                key={"slider_" + moduleName}
                valueLabelDisplay="auto"
                onChangeCommitted={(_, val) => commitSliderVal(moduleName, val)}
                onChange={(_, val) => updateSliderVal(moduleName, val)}
                value={sliderVal[moduleName] ?? 50}
              />
            )}
          </Box>
        );
        
      }
    
    return toggleListArr;
  };

  return makeLayerControlsMenu();
}

export default LayersMenu;
