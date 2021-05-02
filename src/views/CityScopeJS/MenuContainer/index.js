// import EditMenu from './EditMenu'
// import TogglesMenu from './TogglesMenu'
// import SaveMenu from './SaveMenu'
import { Button, Typography, List, ListItem } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import NavigationIcon from '@material-ui/icons/Navigation'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { useEffect, useRef, useState } from 'react'
import TypesMenu from './TypesMenu'
import ABMSubmenu from './ABMSubmenu'
import ShadowSubmenu from './ShadowSubmenu'
import AccessSubmenu from './AccessSubmenu'

function MenuContainer(props) {
  const { cityIOdata, tableName, getMenuState } = props

  const expectedLayers = {
    GRID_LAYER_CHECKBOX: {
      displayName: 'Grid Layer',
      cityIOmoduleName: 'GEOGRID',
      initState: false,
    },
    ABM_LAYER_CHECKBOX: {
      displayName: 'Simulation Layer',
      cityIOmoduleName: 'ABM2',
      initState: false,
    },
    AGGREGATED_TRIPS_LAYER_CHECKBOX: {
      displayName: 'Trips Layer',
      cityIOmoduleName: 'ABM2',
      initState: false,
    },
    ACCESS_LAYER_CHECKBOX: {
      displayName: 'Accessibility Layer',
      cityIOmoduleName: 'access',
      initState: false,
    },
    TEXTUAL_LAYER_CHECKBOX: {
      displayName: 'Text Layer',
      cityIOmoduleName: 'GEOGRID',
      initState: false,
    },
  }

  const viewControlItems = {
    ANIMATE_CHECKBOX: {
      displayName: 'Animate',
      initState: false,
    },
    ROTATE_CHECKBOX: {
      displayName: 'Rotate Camera',
      initState: false,
    },
    SHADOWS_CHECKBOX: {
      displayName: 'Toggle Shadows',
      initState: false,
    },
  }

  const [menuState, setMenuState] = useState({})
  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState()

  useEffect(() => {
    getMenuState(menuState)
  }, [menuState])

  useEffect(() => {
    setMenuState({ ...menuState, SELECTED_TYPE: selectedTypeFromMenu })
  }, [selectedTypeFromMenu])

  const handleCheckboxClick = (event) => {
    setMenuState({
      ...menuState,
      [event.target.name]: event.target.checked,
    })
  }

  const handleButtonClicks = (event) => {
    setMenuState({
      ...menuState,
      [event.currentTarget.id]: !menuState[event.currentTarget.id],
    })
  }

  const createCheckboxes = (toggleList) => {
    const toggleListArr = []
    for (const toggle in toggleList) {
      //  get short module name for each toggle
      const moduleName = toggleList[toggle].cityIOmoduleName
      //  check if this toggle is a layer that requires cityIO
      // or it's visability layer that always show
      if (!toggleList[toggle].cityIOmoduleName || moduleName in cityIOdata) {
        toggleListArr.push(
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={menuState[toggle]}
                key={Math.random()}
                color="primary"
              />
            }
            label={toggleList[toggle].displayName}
            name={toggle}
            key={Math.random()}
            onChange={handleCheckboxClick}
            labelPlacement="end"
          />,
        )
      }
    }
    return toggleListArr
  }

  return (
    <List>
      <ListItem>
        <Button
          id={'EDIT_BUTTON'}
          endIcon={menuState.EDIT_BUTTON ? <CloudUploadIcon /> : <EditIcon />}
          color="default"
          onClick={(e) => handleButtonClicks(e)}
        >
          {menuState.EDIT_BUTTON ? 'commit edits' : 'start editing'}
        </Button>
      </ListItem>

      <TypesMenu
        cityIOdata={cityIOdata}
        getSelectedTypeFromMenu={getSelectedTypeFromMenu}
      />

      <ListItem>
        <Typography variant={'h2'}>Scenarios</Typography>
      </ListItem>
      <ListItem>{/* <SaveMenu tableName={tableName} /> */}</ListItem>

      <ListItem>
        <Typography variant={'h3'}>{tableName}</Typography>
      </ListItem>

      <ListItem>
        <Typography>Display options</Typography>
      </ListItem>

      <ListItem>
        <FormControl component="fieldset">
          <FormLabel component="legend">Layers</FormLabel>
          <FormGroup aria-label="position">
            {createCheckboxes(expectedLayers)}
          </FormGroup>
        </FormControl>
      </ListItem>

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

export default MenuContainer
