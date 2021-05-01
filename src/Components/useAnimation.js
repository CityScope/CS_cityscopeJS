const useAnimationFrame = (callback, toggleAnimate) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      // return the value
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (toggleAnimate) {
      console.log('start anim')

      requestRef.current = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(requestRef.current)
  }, []) // Make sure the effect runs only once
}


  // useAnimationFrame((deltaTime, toggleAnimate) => {
  //   // Pass on a function to the setter of the state
  //   // to make sure we always have the latest state
  //   setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100)
  // })