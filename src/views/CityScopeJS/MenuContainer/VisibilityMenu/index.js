import {
  Button,
  List,
  ListItem,
  Grid,
  Slider,
  Checkbox,
  FormGroup,
} from '@material-ui/core'

import NavigationIcon from '@material-ui/icons/Navigation'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { useLayoutEffect, useState } from 'react'

import { viewControlItems } from '../../../settings/menuSettings'

function VisibilityMenu(props) {
  const { cityIOdata, getMenuState } = props

  const [menuState, setMenuState] = useState({})
  // return the manu state to parent component
  useLayoutEffect(() => {
    getMenuState(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({})
  useLayoutEffect(() => {
    setMenuState({ ...menuState, SELECTED_TYPE: selectedTypeFromMenu })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypeFromMenu])

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
      //  get short module name for each toggle
      const moduleName = menuItemList[menuItem].cityIOmoduleName
      // check if we add slider to this menuItem
      const hasSlider = menuItemList[menuItem].hasSlider
      //  check if this toggle is a layer that requires cityIO
      // or it's visability layer that we always show
      if (
        !menuItemList[menuItem].cityIOmoduleName ||
        moduleName in cityIOdata
      ) {
        toggleListArr.push(
          <Grid container>
            <Grid item xs={9}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    checked={menuState[menuItem] && menuState[menuItem].isOn}
                    key={`cb-${menuItem}`}
                    color="primary"
                  />
                }
                label={menuItemList[menuItem].displayName}
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
                labelPlacement="end"
              />
            </Grid>
            <Grid item xs={3}>
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
            </Grid>
          </Grid>,
        )
      }
    }
    return toggleListArr
  }

  return (
    <List>
      <ListItem>
        <FormControl component="fieldset">
          <FormLabel component="legend">View Settings</FormLabel>
          <FormGroup aria-label="position">
            {createCheckboxes(viewControlItems)}
          </FormGroup>
        </FormControl>
      </ListItem>

      <ListItem>
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
      </ListItem>
    </List>
  )
}

export default VisibilityMenu
