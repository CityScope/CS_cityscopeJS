import { useEffect, useState } from "react";
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

export default function HeatmapLayerControls() {
  const menuState = useSelector((state) => state.menuState);
  const layersMenuState = menuState.layersMenuState;
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const accessData = cityIOdata.access;
  const [radioValue, setRadioValue] = useState();

  const handleChange = (item, index) => {
    setRadioValue(item);
    const newLayersMenuState = {
      ...layersMenuState,
      ACCESS_LAYER_CHECKBOX: {
        ...layersMenuState.ACCESS_LAYER_CHECKBOX,
        selected: index,
      },
    };

    dispatch(updateLayersMenuState(newLayersMenuState));
  };
  // set the default value of the radio button to the first item in the list
  useEffect(() => {
    handleChange(accessData.properties[0], 0);
  }, []);

  const CreateHeatMapArray = () => {
    const accessArray = accessData.properties.map((item, index) => {
      return (
        <FormControlLabel
          key={index + "_access_checkboxFormControlLabel"}
          control={<Radio />}
          label={<Typography variant="caption">{item}</Typography>}
          onChange={() => handleChange(item, index)}
          checked={radioValue === item}
        />
      );
    });
    return (
      <FormControl>
        <RadioGroup value={radioValue} defaultValue={accessData.properties[0]}>
          {accessArray}
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <>
      <CollapsableCard
        variant="outlined"
        subheader="Select Heatmap Layer"
        collapse={true}
      >
        <CreateHeatMapArray />
      </CollapsableCard>
    </>
  );
}
