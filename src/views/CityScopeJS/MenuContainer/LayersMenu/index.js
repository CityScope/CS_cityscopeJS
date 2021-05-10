import {
  List,
  ListItem,
  Slider,
  Checkbox,
  FormGroup,
  Typography,
} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import { useLayoutEffect, useState } from 'react'
import { expectedLayers } from '../../../../settings/menuSettings'

function LayersMenu(props) {
  const { getLayersMenu, cityIOdata } = props

  /**
   * inital state 
   */
  const [menuState, setMenuState] = useState(() => {
    let initState = {}
    for (const menuItem in expectedLayers) {
      initState[menuItem] = { isOn: expectedLayers[menuItem].initState }
    }
    return initState
  })

  // return the manu state to parent component
  useLayoutEffect(() => {
    getLayersMenu(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [sliderVal, setSliderVal] = useState()

  const updateSliderVal = (menuItem, val) => {
    setSliderVal({ ...sliderVal, [menuItem]: val })
  }

  const createCheckboxes = (menuLayersList) => {
    const toggleListArr = []
    for (const menuItem in menuLayersList) {
      //  get short module name for each toggle
      const moduleName = menuLayersList[menuItem].cityIOmoduleName
      // check if we add slider to this menuItem
      const hasSlider = menuLayersList[menuItem].hasSlider
      //  check if this toggle is a layer that requires cityIO
      // or it's visability layer that we always show
      if (
        !menuLayersList[menuItem].cityIOmoduleName ||
        moduleName in cityIOdata
      ) {
        toggleListArr.push(
          <div key={`div-${menuItem}`}>
            <Checkbox
              checked={menuState[menuItem] && menuState[menuItem].isOn}
              key={`cb-${menuItem}`}
              color="primary"
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
            <Typography key={`text-${menuItem}`}>
              {menuLayersList[menuItem].displayName}
            </Typography>

            {hasSlider && menuState[menuItem] && menuState[menuItem].isOn && (
              <Slider
                key={`slider-${menuItem}`}
                value={sliderVal && sliderVal[menuItem]}
                valueLabelDisplay="auto"
                // ! pass both val and name of slider
                // ! to keep it between updates
                onChange={(e, val) => updateSliderVal(menuItem, val)}
                onMouseUp={() =>
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
          </div>,
        )
      }
    }

    return toggleListArr
  }

  return (
    <List>
      <ListItem>
        <FormControl component="fieldset">
          <FormGroup aria-label="position">
            {createCheckboxes(expectedLayers)}
          </FormGroup>
        </FormControl>
      </ListItem>
    </List>
  )
}

export default LayersMenu
