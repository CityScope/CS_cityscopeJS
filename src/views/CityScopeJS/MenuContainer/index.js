import { Button, Typography, List, ListItem } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { useLayoutEffect, useMemo, useState } from 'react'
import TypesMenu from './TypesMenu'
import LayersMenu from './LayersMenu'

function MenuContainer(props) {
  const { cityIOdata, getMenuState } = props
  const [menuState, setMenuState] = useState({})
  // return the manu state to parent component
  useLayoutEffect(() => {
    getMenuState(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({})
  const [layersMenu, getLayersMenu] = useState({})

  useMemo(() => {
    setMenuState({
      ...menuState,
      SELECTED_TYPE: selectedTypeFromMenu,
      LAYERS_MENU: layersMenu,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypeFromMenu, layersMenu])

  const handleButtonClicks = (event) => {
    setMenuState({
      ...menuState,
      [event.currentTarget.id]: !menuState[event.currentTarget.id],
    })
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
        <Typography>Layers options</Typography>
        <LayersMenu cityIOdata={cityIOdata} getLayersMenu={getLayersMenu} />
      </ListItem>

      <ListItem>
        <Typography>Display options</Typography>
      </ListItem>

      <ListItem></ListItem>
    </List>
  )
}

export default MenuContainer
