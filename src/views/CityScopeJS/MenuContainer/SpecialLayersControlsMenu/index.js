import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  FormControl,
} from "@mui/material";
import { updateLayersMenuState } from "../../../../redux/reducers/menuSlice";

export default function SpecialLayersControlsMenu() {
  const menuState = useSelector((state) => state.menuState);
  const layersMenuState = menuState.layersMenuState;
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const accessData = cityIOdata.access;
  const abmData = cityIOdata.ABM2;
  const [radioValue, setRadioValue] = useState();
  const handleChange = (item, index) => {

    setRadioValue(item);
    dispatch(
      updateLayersMenuState({
        ...layersMenuState,
        ACCESS_LAYER_CHECKBOX: {
          ...layersMenuState.ACCESS_LAYER_CHECKBOX,
          selected: index,
        },
      })
    );
  };

  const CreateAccessArray = () => {
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
      <CreateAccessArray />
    </>
  );
}
