import MenuContainer from './MenuContainer'
// import MapContainer from './DeckglMap'
import LoadingSpinner from './CityIO/LoadingSpinner'
// import VisContainer from './VisContainer'
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Container,
} from '@material-ui/core'
import Page from '../../layouts/Page'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}))

export default function CSjsMain(props) {
  const classes = useStyles()
  const { tableName, cityIOdata } = props
  // state func to pass to the menu components
  // to get user interaction
  // and send  map object
  const [menuState, getMenuState] = useState({})

  console.log(menuState && menuState)

  return (
    <Page className={classes.root} title="CitySCopeJS">
      <LoadingSpinner />
      <Container maxWidth={null}>
        <Grid container spacing={5}>
          <Grid item xs={12} l={2} md={3} xl={2} container>
            <Grid item container direction="column" spacing={2}>
              <Grid item xs={12} l={12} md={12} xl={12}>
                <Card
                  elevation={15}
                  style={{
                    maxHeight: '85vh',
                    overflow: 'auto',
                  }}
                >
                  <CardContent>
                    <MenuContainer
                      cityIOdata={cityIOdata}
                      tableName={tableName}
                      getMenuState={getMenuState}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} l={6} md={6} xl={8}>
            <Card
              elevation={15}
              style={{
                height: '85vh',
                width: '100%',
                position: 'relative',
              }}
            >
              {/* <MapContainer cityIOdata={cityIOdata} menuState={menuState} /> */}
            </Card>
          </Grid>
          <Grid item xs={12} l={3} md={3} xl={2}>
            <Card
              elevation={15}
              style={{
                maxHeight: '85vh',
                overflow: 'auto',
              }}
            >
              {/* <VisContainer cityIOdata={cityIOdata} /> */}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
