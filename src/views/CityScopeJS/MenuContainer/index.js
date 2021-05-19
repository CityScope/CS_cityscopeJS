import { Button, Typography, List, ListItem } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { useLayoutEffect, useMemo, useState } from 'react'
import TypesMenu from './TypesMenu'
import LayersMenu from './LayersMenu'
import VisibilityMenu from './VisibilityMenu'

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
  const [visibiltyMenu, getVisibiltyMenu] = useState({})

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
        <Typography variant={'h4'}>Editing Menu</Typography>
      </ListItem>

      <ListItem>
        <Button
          id={'EDIT_BUTTON'}
          endIcon={menuState.EDIT_BUTTON ? <CloudUploadIcon /> : <EditIcon />}
          color="default"
          onClick={(e) => handleButtonClicks(e)}
        >
          <Typography variant={'h5'}>
            {menuState.EDIT_BUTTON ? 'submit edits' : 'start editing'}
          </Typography>
        </Button>
      </ListItem>

      <TypesMenu
        cityIOdata={cityIOdata}
        getSelectedTypeFromMenu={getSelectedTypeFromMenu}
      />

      <ListItem>
        <Typography variant={'h4'}>Layers options</Typography>
      </ListItem>
      <LayersMenu cityIOdata={cityIOdata} getLayersMenu={getLayersMenu} />

      <ListItem>
        <Typography variant={'h4'}>Display options</Typography>
      </ListItem>
      <VisibilityMenu getVisibiltyMenu={getVisibiltyMenu} />
    </List>
  )
}

export default MenuContainer
