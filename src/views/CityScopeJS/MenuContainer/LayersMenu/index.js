import {
  Slider,
  Checkbox,
  Typography,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { expectedLayers } from "../../../../settings/settings";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";

export default function LayersMenu() {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  // get the keys from cityIOdata
  const cityIOkeys = Object.keys(cityIOdata);

  // initial layer menu state
  let initState = {};
  const [layersMenuState, setLayersMenuState] = useState(() => {
    for (const menuItem in expectedLayers) {
      initState[menuItem] = {
        isOn: expectedLayers[menuItem].initState,
        slider: expectedLayers[menuItem].initSliderValue
          ? expectedLayers[menuItem].initSliderValue
          : false,
      };
    }
    return initState;
  });

  useEffect(() => {
    dispatch(updateLayersMenuState(layersMenuState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersMenuState]);

  // update the layer slider value
  const [sliderVal, setSliderVal] = useState({});
  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val });

    setLayersMenuState({
      ...layersMenuState,
      [menuItem]: {
        ...layersMenuState[menuItem],
        slider: val,
      },
    });
  };

  const MakeLayerControlsMenu = () => {
    const toggleListArr = [];
    // loop through the keys in cityIOdata and make a list of keys
    for (const menuItem in expectedLayers) {
      const moduleName = expectedLayers[menuItem].cityIOmoduleName;
      // if the module name is in the data for this CS instance, make a checkbox
      if (cityIOkeys.includes(moduleName)) {
        toggleListArr.push(
          <div
            style={{ display: "block", textAlign: "left" }}
            key={menuItem + "_layersMenu_checkbox"}
          >
            
            <FormControlLabel
              key={"formControl_" + menuItem}
              control={
                <Checkbox
                  checked={
                    layersMenuState[menuItem] && layersMenuState[menuItem].isOn
                  }
                  key={"checkbox_" + menuItem}
                  color="primary"
                  onChange={(e) => {
                    setLayersMenuState({
                      ...layersMenuState,
                      [menuItem]: {
                        ...layersMenuState[menuItem],
                        isOn: e.target.checked,
                      },
                    });
                  }}
                />
              }
              label={
                <Typography variant="caption" key={"label_" + menuItem}>
                  {expectedLayers[menuItem].displayName}
                </Typography>
              }
            />
            {layersMenuState[menuItem] &&
              layersMenuState[menuItem].isOn &&
              expectedLayers[menuItem].initSliderValue && (
                <Slider
                  size="small"
                  key={"slider_" + menuItem}
                  valueLabelDisplay="auto"
                  onChangeCommitted={(_, val) => updateSliderVal(menuItem, val)}
                  value={sliderVal[menuItem]}
                />
              )}
          </div>
        );
      }
    }
    return toggleListArr;
  };

  return <MakeLayerControlsMenu />;
}
