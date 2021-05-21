import { Button, Typography, List, ListItem } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { useLayoutEffect, useMemo, useState } from 'react'
import TypesMenu from './TypesMenu'
import LayersMenu from './LayersMenu'
import VisibilityMenu from './VisibilityMenu'
import Anim from './Anim'

function MenuContainer(props) {
  const { cityIOdata, getMenuState } = props
  const [menuState, setMenuState] = useState({})
  // return the manu state to parent component
  useLayoutEffect(() => {
    getMenuState(menuState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const [selectedTypeFromMenu, getSelectedTypeFromMenu] = useState({})
  const [animationTime, getAnimationTime] = useState()
  console.log(animationTime)

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
        <Typography variant={'h3'}>Edit</Typography>
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
        <Typography variant={'h3'}>Layers</Typography>
      </ListItem>
      <LayersMenu cityIOdata={cityIOdata} getLayersMenu={getLayersMenu} />

      <ListItem>
        <Typography variant={'h3'}>Display</Typography>
      </ListItem>
      <VisibilityMenu getVisibiltyMenu={getVisibiltyMenu} />
      {visibiltyMenu && (
        <Anim
          getAnimationTime={getAnimationTime}
          visibiltyMenu={
            visibiltyMenu.ANIMATE_CHECKBOX &&
            visibiltyMenu.ANIMATE_CHECKBOX.isOn
          }
        />
      )}
    </List>
  )
}

export default MenuContainer
