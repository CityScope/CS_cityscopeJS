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

/** */

/** ANIMATION */
const toggleAnimate = menuState && menuState.ANIMATE_CHECKBOX
const [animationTime, setAnimationTime] = useState(0)
const requestRef = useRef()
const previousTimeRef = useRef()

useEffect(() => {
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      setAnimationTime((prevTime) => {
        if (prevTime < 21600 || prevTime > 43200) {
          return 21600
        }
        return prevTime + 5
      })
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  if (menuState.ANIMATE_CHECKBOX) {
    console.log('animation started..')
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  } else {
    console.log('animation stopped!')
    return () => cancelAnimationFrame(requestRef.current)
  }
}, [toggleAnimate])
/** ANIMATION */
