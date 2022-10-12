import { useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export default function SpecialLayersControlsMenu() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const accessData = cityIOdata.access;
  const abmData = cityIOdata.ABM2;

  const CreateAccessArray = () => {
    const accessArray = accessData.properties.map((item, index) => {
      return (
        <FormControlLabel
          key={index + "_access_checkboxFormControlLabel"}
          control={<Checkbox key={index + "_access_checkbox"} label={item} />}
          label={item}
          onChange={(e, i) => {
            console.log(e.target.checked, index);
          }}
        />
      );
    });
    return <FormGroup>{accessArray}</FormGroup>;
  };

  return (
    <>
      <CreateAccessArray />
    </>
  );
}
