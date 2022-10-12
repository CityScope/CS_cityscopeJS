import {
  Slider,
  Checkbox,
  Typography,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function LayerItem(props) {
  //   initial layer menu state
  const layersMenuReduxState = useSelector(
    (state) => state.menuState.layersMenuState
  );
  let initState = {};
  const { layerMenuItem } = props;
  const layerName = layerMenuItem.displayName;
  const dispatch = useDispatch();

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

  const updateSlider = (menuItem, val) => {
    console.log("updateSlider", menuItem, val);
    // setSliderVal({ ...sliderVal, [menuItem]: val });
  };

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

  return <ToggleButton value={layerName}>{layerName}</ToggleButton>;
}

<FormControlLabel
  key={"formControl_" + menuItem}
  control={
    <Checkbox
      checked={layersMenuState[menuItem] && layersMenuState[menuItem].isOn}
      key={"checkbox_" + menuItem}
      color="primary"
      onChange={(e) => {
        setLayersMenuState({
          ...layersMenuReduxState,
          [menuItem]: {
            ...layersMenuReduxState[menuItem],
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
/>;
{
  layersMenuState[menuItem].isOn && expectedLayers[menuItem].initSliderValue && (
    <Slider
      size="small"
      key={"slider_" + menuItem}
      valueLabelDisplay="auto"
      onChange={updateSlider}
      // onChangeCommitted={(_, val) => updateSliderVal(menuItem, val)}
      value={sliderVal[menuItem]}
    />
  );
}
