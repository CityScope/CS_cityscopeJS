import { Slider, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAnimationMenuState } from "../../../../redux/reducers/menuSlice";
import AnimationComponent from "../../../../Components/AnimationComponent.js";

function AnimationMenu() {
  const [animationState, setAnimationState] = useState(
    useSelector((state) => state.menuState.animationMenuState)
  );
  const [animationTime, getAnimationTime] = useState(0);
  const dispatch = useDispatch();

  // controls the menu state for the edit button
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
      <AnimationComponent getAnimationTime={getAnimationTime} />
      <Button
        fullWidth
        id={"toggleAnimationState"}
        variant="outlined"
        onClick={(e) => handleAnimationButtonClicks(e)}
      >
        <Typography>Toggle Animation</Typography>
      </Button>

      <Slider size="small" key={"slider_animation"} valueLabelDisplay="auto" />
      <Typography variant="subtitle2" id="continuous-slider" gutterBottom>
        {animationTime}
      </Typography>
    </>
  );
}

export default AnimationMenu;
