import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import NavBar from './NavBar'
import TopBar from './TopBar'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },

  content: {
    paddingTop: 48,
    flex: '1 1 auto',
    height: '100vh',
    overflow: 'auto',
  },
}))

const MainLayout = () => {
  const classes = useStyles()
  const [navMenuState, setNavMenuState] = useState(true)

  return (
    <div className={classes.root}>
      <NavBar
        openNavDrawer={!navMenuState}
        onMobileNavOpen={() => setNavMenuState(!navMenuState)}
      />
      <TopBar onMobileNavOpen={() => setNavMenuState(!navMenuState)} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
