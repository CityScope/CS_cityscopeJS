import {
  List,
  ListItem,
  Grid,
  Slider,
  Checkbox,
  FormGroup,
} from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { useLayoutEffect, useState } from 'react'
import { expectedLayers } from '../../../../settings/menuSettings'

function LayersMenu(props) {
  const { getLayersMenu, cityIOdata } = props

  const [menuState, setMenuState] = useState({})
  // return the manu state to parent component
  useLayoutEffect(() => {
    getLayersMenu(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [sliderVal, setSliderVal] = useState(0)

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
          <Grid key={Math.random()} container>
            <Grid key={Math.random()} item xs={12}>
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
            <Grid item xs={12}>
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
          <FormGroup aria-label="position">
            {createCheckboxes(expectedLayers)}
          </FormGroup>
        </FormControl>
      </ListItem>
    </List>
  )
}

export default LayersMenu
