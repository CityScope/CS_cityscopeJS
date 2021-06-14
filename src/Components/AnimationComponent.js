import { useEffect, useState, useRef } from 'react'

export default function AnimationComponent(props) {
  const { getAnimationTime, animationToggle } = props

    
  const [animationTime, setAnimationTime] = useState(0)
  const requestRef = useRef()
  const previousTimeRef = useRef()

  useEffect(() => {
    // ! this should be converted to React Context 
    // getAnimationTime(animationTime)
    console.log(animationTime);
  }, [animationTime])

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        setAnimationTime((prevTime) => {
          if (prevTime < 21600 || prevTime > 43200) {
            return 21600
          }
          return prevTime + 50
        })
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }
    if (animationToggle) {
      console.log('animation started..')
      requestRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(requestRef.current)
    } else {
      console.log('animation stopped!')
      return () => cancelAnimationFrame(requestRef.current)
    }
  }, [animationToggle])

  return null
}
