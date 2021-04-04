import {
  Card,
  CardContent,
  makeStyles,
  Grid,
  Container,
} from '@material-ui/core'
import CityIOlist from './CityIOlist'
import Page from '../../layouts/Page'
import SplashScreen from './SplashScreen'

export default function CityIOviewer() {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: 'auto',
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
      },
    },
  }))

  const classes = useStyles()
  return (
    <>
      <Page className={classes.root} title="CityScope Projects List">
        <Container>
          <Grid container>
            <Grid item xs={12} l={4} md={4} xl={4}>
              <SplashScreen />
            </Grid>
            <Grid item xs={12} l={8} md={8} xl={8}>
              <Card
                elevation={15}
                style={{
                  height: '85vh',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <CardContent>{<CityIOlist />}</CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>
  )
}
