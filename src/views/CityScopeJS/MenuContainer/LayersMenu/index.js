import { useSelector, useDispatch } from "react-redux";
import { expectedLayers } from "../../../../settings/settings";
import { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";

export default function LayersMenu() {
  const dispatch = useDispatch();

  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get the keys from cityIOdata
  const cityIOkeys = Object.keys(cityIOdata);

  const [layersButtonVal, setLayersButtonVal] = useState(() => {
    const initState = [];
    for (const menuItem in expectedLayers) {
      if (expectedLayers[menuItem].initState) {
        initState.push(expectedLayers[menuItem].displayName);
      }
    }
    console.log(initState);
    return initState;
  });

  const handleToggle = (event, toggledLayer) => {
    console.log(layersButtonVal);
    setLayersButtonVal(toggledLayer);
    // dispatch(updateLayersMenuState(toggledLayer));
  };

  const MakeLayerControlsMenu = () => {
    const toggleListArr = [];
    // loop through the keys in cityIOdata and make a list of keys
    for (const layerMenuItem in expectedLayers) {
      const moduleName = expectedLayers[layerMenuItem].cityIOmoduleName;
      // if the module name is in the data for this CS instance, make a checkbox
      if (cityIOkeys.includes(moduleName)) {
        toggleListArr.push(
          <ToggleButton
            key={layerMenuItem}
            value={expectedLayers[layerMenuItem].displayName}
          >
            {expectedLayers[layerMenuItem].displayName}
          </ToggleButton>
        );
      }
    }
    return (
      <ToggleButtonGroup
        fullWidth
        value={layersButtonVal}
        orientation="vertical"
        onChange={handleToggle}
      >
        {toggleListArr}
      </ToggleButtonGroup>
    );
  };

  return <MakeLayerControlsMenu />;
}
