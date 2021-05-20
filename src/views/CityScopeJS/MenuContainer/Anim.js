import { useEffect, useState, useRef } from 'react'

export default function Anim(props) {
  const { getAnimationTime, visibiltyMenu } = props
  const animationToggle =
    visibiltyMenu.ANIMATE_CHECKBOX && visibiltyMenu.ANIMATE_CHECKBOX.isOn
  const [animationTime, setAnimationTime] = useState(0)
  const requestRef = useRef()
  const previousTimeRef = useRef()

  useEffect(() => {
    getAnimationTime(animationTime)
  }, [animationTime])

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
