import {
  Slider,
  Checkbox,
  Typography,
  FormControlLabel,
  List,
  ListItem,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { expectedLayers } from "../../../../settings/menuSettings";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";

function LayersMenu() {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get the keys from cityIOdata
  const cityIOkeys = Object.keys(cityIOdata);

  /**
   * initial layer menu state
   */
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

  const [sliderVal, setSliderVal] = useState({});

  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val });
    setLayersMenuState({
      ...layersMenuState,
      [menuItem]: {
        ...layersMenuState[menuItem],
        val: val,
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
          <ListItem>
            <FormControlLabel
              key={Math.random()}
              control={
                <Checkbox
                  checked={
                    layersMenuState[menuItem] && layersMenuState[menuItem].isOn
                  }
                  key={Math.random()}
                  color="primary"
                  onChange={(e) =>
                    setLayersMenuState({
                      ...layersMenuState,
                      [menuItem]: {
                        ...layersMenuState[menuItem],
                        isOn: e.target.checked,
                      },
                    })
                  }
                />
              }
              label={
                <Typography variant="caption" key={Math.random()}>
                  {expectedLayers[menuItem].displayName}
                </Typography>
              }
            />
            {/* and make a slider  */}
            <Slider
              size="small"
              defaultValue={70}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChangeCommitted={(_, val) => updateSliderVal(moduleName, val)}
            />
          </ListItem>
        );
      }
    }
    return toggleListArr;
  };

  return <List>{makeLayerControlsMenu()}</List>;
}

export default LayersMenu;
