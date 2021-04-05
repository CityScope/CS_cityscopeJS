import { makeStyles, Container } from '@material-ui/core'
import CityIOlist from './CityIOlist'
import Page from '../../layouts/Page'
import SplashScreen from './SplashScreen'

export default function CityIOviewer() {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: 'auto',
        height: '100%',
        padding: theme.spacing(3),
      },
    },
    fixedPosition: {
      position: 'relative',
      zIndex: 100,
    },
  }))

  const classes = useStyles()
  return (
    <>
      <Page className={classes.root} title="CityScope Projects List">
        <div
          style={{
            height: '50vh',
            width: '100%',
            position: 'relative',
          }}
        >
          <CityIOlist />
        </div>

        <Container className={classes.fixedPosition}>
          <SplashScreen />
        </Container>
      </Page>
    </>
  )
}
