import { Slider, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAnimationMenuState } from "../../../redux/reducers/menuSlice";

function AnimationMenu() {
  const dispatch = useDispatch();

  const [animationState, setAnimationState] = useState(
    useSelector((state) => state.menuState.animationMenuState)
  );
  const animationTime = useSelector(
    (state) => state.animationState.animationTime
  );

  const updateSliderVal = (val) => {
    setAnimationState({
      ...animationState,
      animationSpeedSliderValue: val / 5,
    });
  };

  // controls the menu state for the button
  const handleAnimationButtonClicks = (event) => {
    setAnimationState({
      ...animationState,
      [event.currentTarget.id]: !animationState[event.currentTarget.id],
    });
  };

  useEffect(() => {
    dispatch(updateAnimationMenuState(animationState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationState]);

  return (
    <>
      <Button
        fullWidth
        id={"toggleAnimationState"}
        variant="outlined"
        onClick={(e) => handleAnimationButtonClicks(e)}
      >
        <Typography>Toggle Animation</Typography>
      </Button>

      <Slider
        size="small"
        key={"slider_animation"}
        valueLabelDisplay="auto"
        onChangeCommitted={(_, val) => updateSliderVal(val)}
      />
      <Typography variant="subtitle2" id="continuous-slider" gutterBottom>
        {animationTime}
      </Typography>
    </>
  );
}

export default AnimationMenu;
