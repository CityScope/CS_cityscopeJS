import EditMenu from './EditMenu'
import TogglesMenu from './TogglesMenu'
import SaveMenu from './SaveMenu'
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
    GRID: {
      displayName: 'Grid Layer',
      cityIOmoduleName: 'GEOGRID',
    },
    ABM: {
      displayName: 'Simulation Layer',
      cityIOmoduleName: 'ABM2',
    },
    AGGREGATED_TRIPS: {
      displayName: 'Trips Layer',
      cityIOmoduleName: 'ABM2',
    },
    ACCESS: {
      displayName: 'Accessibility Layer',
      cityIOmoduleName: 'access',
    },
    TEXTUAL: {
      displayName: 'Text Layer',
      cityIOmoduleName: 'GEOGRID',
    },
  }

  const viewControlItems = {
    ROTATE: {
      displayName: 'Rotate Camera',
    },
    SHADOWS: {
      displayName: 'Toggle Shadows',
    },
  }

  const [state, setState] = useState({})

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
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
              checked={state[toggle]}
              key={Math.random()}
              color="primary"
            />
          }
          label={toggleList[toggle].displayName}
          name={toggle}
          key={Math.random()}
          onChange={handleChange}
          labelPlacement="end"
        />,
      )
    }
    return toggleListArr
  }
  console.log(state)

  return (
    <>
      <List>
        {/* <ListItem>
          <Typography variant={'h2'}>Grid Edit</Typography>
        </ListItem>
        <ListItem>
          <Button
            startIcon={
              menuState.includes('EDIT') ? (
                <>
                  <CloudUploadIcon />
                  Send to cityIO
                </>
              ) : (
                <>
                  <EditIcon />
                  Edit Mode
                </>
              )
            }
            color="default"
            onClick={handleToggle('EDIT')}
          ></Button>
        </ListItem>

        <EditMenu />

        <ListItem>
          <Typography variant={'h2'}>Scenarios</Typography>
        </ListItem>
        <ListItem>
          <SaveMenu tableName={tableName} handleToggle={handleToggle} />
        </ListItem> */}

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

      {/* <TogglesMenu /> */}
    </>
  )
}

export default MenuContainer
