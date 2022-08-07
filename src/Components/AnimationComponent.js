import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function AnimationComponent(props) {
  const getAnimationTime = props.getAnimationTime;
  const animationMenuState = useSelector(
    (state) => state.menuState.animationMenuState
  );
  const [animationTime, setAnimationTime] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      setAnimationTime((t) => {
        return t > mapSettings.map.layers.ABM.endTime
          ? mapSettings.map.layers.ABM.startTime
          : t + animationMenuState.animationSpeedSliderValue || 1;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (animationMenuState && animationMenuState.toggleAnimationState) {
      console.log("animation started..");
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    } else {
      cancelAnimationFrame(previousTimeRef.current);
      cancelAnimationFrame(requestRef.current);
      console.log("animation stopped!");
      return () => cancelAnimationFrame(requestRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationMenuState]);

  // update the getAnimationTime function with the current animation time
  useEffect(() => {
    getAnimationTime(animationTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationTime]);

  return null;
}
