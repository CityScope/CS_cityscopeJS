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

function LayersMenu() {
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
        slider: expectedLayers[menuItem].initSliderValue,
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

  const toggleListArr = [];
  const makeLayerControlsMenu = () => {
    // loop through the keys in cityIOdata and make a list of keys
    for (const menuItem in expectedLayers) {
      const moduleName = expectedLayers[menuItem].cityIOmoduleName;
      // if the module name is in the data for this CS instance, make a checkbox
      if (cityIOkeys.includes(moduleName)) {
        toggleListArr.push(
          <Grid container key={`grid_con_` + menuItem}>
            <Grid item xs={4} key={`grid_i_1_` + menuItem}>
              <FormControlLabel
                key={"formControl_" + menuItem}
                control={
                  <Checkbox
                    checked={
                      layersMenuState[menuItem] &&
                      layersMenuState[menuItem].isOn
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
            </Grid>
            {layersMenuState[menuItem] && layersMenuState[menuItem].isOn && (
              <Grid item xs={8} key={`grid_i_2_` + menuItem}>
                <Slider
                  size="small"
                  key={"slider_" + menuItem}
                  valueLabelDisplay="auto"
                  onChangeCommitted={(_, val) => updateSliderVal(menuItem, val)}
                />
              </Grid>
            )}
          </Grid>
        );
      }
    }
    return toggleListArr;
  };

  const tuiMenuControl = cityIOdata.tui || null;
  useEffect(() => {
    if (!tuiMenuControl) return;
    tuiMenuControl.forEach((menuItem) => {
      setLayersMenuState({
        ...layersMenuState,
        // [Object.keys(menuItem) + "_LAYER_CHECKBOX"]
        GRID_LAYER_CHECKBOX
        : {
          ...layersMenuState[Object.keys(menuItem)],
          isOn: Object.values(menuItem)[0],
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuiMenuControl]);

  console.log(
    layersMenuState.GRID_LAYER_CHECKBOX && layersMenuState.GRID_LAYER_CHECKBOX
  );

  return <Grid container>{makeLayerControlsMenu()}</Grid>;
}

export default LayersMenu;
