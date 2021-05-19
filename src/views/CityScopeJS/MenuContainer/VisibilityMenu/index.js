import { Button, Typography, Slider, Checkbox, Box } from '@material-ui/core'
import NavigationIcon from '@material-ui/icons/Navigation'
import { useLayoutEffect, useState } from 'react'
import { viewControlItems } from '../../../../settings/menuSettings'

function VisibilityMenu(props) {
  const { getVisibiltyMenu } = props
  const [menuState, setMenuState] = useState(() => {
    let initState = {}
    for (const menuItem in viewControlItems) {
      initState[menuItem] = {
        isOn: viewControlItems[menuItem].initState,
        slider:
          viewControlItems[menuItem].hasSlider &&
          viewControlItems[menuItem].initSliderValue,
      }
    }
    return initState
  })

  // return the manu state to parent component
  useLayoutEffect(() => {
    getVisibiltyMenu(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [sliderVal, setSliderVal] = useState(0)

  const handleButtonClicks = (event) => {
    setMenuState({
      ...menuState,
      [event.currentTarget.id]: !menuState[event.currentTarget.id],
    })
  }

  const createCheckboxes = (menuItemList) => {
    const toggleListArr = []
    for (const menuItem in menuItemList) {
      // check if we add slider to this menuItem
      const hasSlider = menuItemList[menuItem].hasSlider
      //  check if this toggle is a layer that requires cityIO
      // or it's visability layer that we always show
      if (!menuItemList[menuItem].cityIOmoduleName) {
        toggleListArr.push(
          <Box key={`div-${menuItem}`}>
            <Checkbox
              checked={menuState[menuItem] && menuState[menuItem].isOn}
              key={`cb-${menuItem}`}
              color="primary"
              name={menuItem}
              key={Math.random()}
              onChange={(e) =>
                setMenuState({
                  ...menuState,
                  [menuItem]: {
                    ...menuState[menuItem],
                    isOn: e.target.checked,
                  },
                })
              }
            />
            <Typography variant={'caption'} key={`text-${menuItem}`}>
              {menuItemList[menuItem].displayName}
            </Typography>

            {hasSlider && menuState[menuItem] && menuState[menuItem].isOn && (
              <Slider
                key={`slider-${menuItem}`}
                value={sliderVal.value}
                valueLabelDisplay="auto"
                // ! pass both val and name of slider
                // ! to keep it between updates
                onChange={(e, val) => setSliderVal({ [menuItem]: val })}
                onMouseUp={(e, val) =>
                  setMenuState({
                    ...menuState,
                    [menuItem]: {
                      ...menuState[menuItem],
                      slider: sliderVal[menuItem],
                    },
                  })
                }
              />
            )}
          </Box>,
        )
      }
    }
    return toggleListArr
  }

  return (
    <>
      <Button
        startIcon={
          <>
            <NavigationIcon />
            Reset View
          </>
        }
        id={'RESET_VIEW_BUTTON'}
        onClick={(e) => handleButtonClicks(e)}
        color="default"
      />
      {createCheckboxes(viewControlItems)}
    </>
  )
}

export default VisibilityMenu
