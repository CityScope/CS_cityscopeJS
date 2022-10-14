import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  FormControl,
} from "@mui/material";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";
import CollapsableCard from "../../../../Components/CollapsableCard";

export default function ABMLayerControls() {
  const menuState = useSelector((state) => state.menuState);
  const layersMenuState = menuState.layersMenuState;
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  const abmData = cityIOdata.ABM2;
  const mode = abmData.attr.mode;
  const profile = abmData.attr.profile;
  const [radioValue, setRadioValue] = useState(null);

  const handleChange = (item, index) => {
    setRadioValue(item);

    const newAbmLayerState = {
      ...layersMenuState,
      ABM_LAYER_CHECKBOX: {
        ...layersMenuState.ABM_LAYER_CHECKBOX,
        selected: index,
      },
    };
    dispatch(updateLayersMenuState(newAbmLayerState));
  };

  // set the default value of the radio button to the first item in the list
  useEffect(() => {
    // first item in obj
    handleChange(mode["0"].name, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createHeatMapArray = (object) => {
    let heatMapArray = [];
    for (const item in object) {
      heatMapArray.push(
        <FormControlLabel
          key={item + "_access_checkboxFormControlLabel"}
          control={<Radio />}
          label={<Typography variant="caption">{object[item].name}</Typography>}
          onChange={() => handleChange(object[item].name, parseInt(item))}
          checked={radioValue === object[item].name}
        />
      );
    }
    return (
      <FormControl>
        <RadioGroup value={radioValue}>{heatMapArray}</RadioGroup>
      </FormControl>
    );
  };

  return (
    <>
      <CollapsableCard
        variant="outlined"
        subheader="Select ABM Sub-Layer"
        collapse={true}
      >
        {createHeatMapArray(mode)}
        {createHeatMapArray(profile)}
      </CollapsableCard>
    </>
  );
}
