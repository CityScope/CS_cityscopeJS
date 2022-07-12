import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function AnimationComponent(props) {
  const getAnimationTime = props.getAnimationTime;
  const animationToggleState = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  const [animationTime, setAnimationTime] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        setAnimationTime((prevTime) => {
          if (prevTime < 21600 || prevTime > 43200) {
            return 21600;
          }
          return prevTime + 50;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    if (animationToggleState) {
      console.log("animation started..");
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    } else {
      console.log("animation stopped!");
      return () => cancelAnimationFrame(requestRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationToggleState]);

  // update the getAnimationTime function with the current animation time
  useEffect(() => {
    getAnimationTime(animationTime);
  }, [animationTime]);

  return null;
}
