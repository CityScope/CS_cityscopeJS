import MenuContainer from './MenuContainer'
import MapContainer from './DeckglMap'
import LoadingSpinner from './CityIO/LoadingSpinner'
import VisContainer from './VisContainer'
import {
  makeStyles,
  Grid,
  Card,
  CardContent,
  Container,
} from '@material-ui/core'
import Page from '../../layouts/Page'


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
  const tableName = props.tableName
  const cityIOdata = props.cityIOdata

  return (
    <Page className={classes.root} title="CitySCopeJS">
      <LoadingSpinner />
      <Container maxWidth={null}>
        <Grid container spacing={5}>
          <Grid item xs={6} l={3} md={3} xl={2} container>
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
                    <MenuContainer tableName={tableName} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} l={6} md={6} xl={8}>
            <Card
              elevation={15}
              style={{
                height: '85vh',
                width: '100%',
                position: 'relative',
              }}
            >
              {/* <Test/> */}
              <MapContainer />
            </Card>
          </Grid>
          <Grid item xs={6} l={3} md={3} xl={2}>
            <Card
              elevation={15}
              style={{
                maxHeight: '85vh',
                overflow: 'auto',
              }}
            >
              <VisContainer cityIOdata={cityIOdata} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
