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
import { useState } from 'react'

function MenuContainer(props) {
  const { cityIOdata, tableName, setNavMenuState } = props

  const expectedLayers = {
    GRID_CHECKBOX: {
      displayName: 'Grid Layer',
      cityIOmoduleName: 'GEOGRID',
    },
    ABM_CHECKBOX: {
      displayName: 'Simulation Layer',
      cityIOmoduleName: 'ABM2',
    },
    AGGREGATED_TRIPS_CHECKBOX: {
      displayName: 'Trips Layer',
      cityIOmoduleName: 'ABM2',
    },
    ACCESS_CHECKBOX: {
      displayName: 'Accessibility Layer',
      cityIOmoduleName: 'access',
    },
    TEXTUAL_CHECKBOX: {
      displayName: 'Text Layer',
      cityIOmoduleName: 'GEOGRID',
    },
  }

  const viewControlItems = {
    ROTATE_CHECKBOX: {
      displayName: 'Rotate Camera',
    },
    SHADOWS_CHECKBOX: {
      displayName: 'Toggle Shadows',
    },
  }

  const [menuState, setMenuState] = useState({})

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

  const createLayersToggles = (toggleList) => {
    const toggleListArr = []
    for (const toggle in toggleList) {
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
    return toggleListArr
  }
  console.log(menuState)

  return (
    <List>
      <ListItem>
        <Button
          id={'EDIT_BUTTON'}
          endIcon={menuState['editButton'] ? <CloudUploadIcon /> : <EditIcon />}
          color="default"
          onClick={(e) => handleButtonClicks(e)}
        >
          {menuState.editButton ? 'commit edits' : 'start editing'}
        </Button>
      </ListItem>

      {/* <EditMenu /> */}

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
            {createLayersToggles(expectedLayers)}
          </FormGroup>
        </FormControl>
      </ListItem>

      <ListItem>
        <FormControl component="fieldset">
          <FormLabel component="legend">View Settings</FormLabel>
          <FormGroup aria-label="position">
            {createLayersToggles(viewControlItems)}
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
          color="default"
        />
      </ListItem>
    </List>
  )
}

export default MenuContainer
