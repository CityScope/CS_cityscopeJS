import {
  Divider,
  Typography,
  makeStyles,
  Card,
  CardContent,
  Link,
} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import GetGITdate from './GetGITdate'

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2),
  },
}))
export default function SplashScreen() {
  const classes = useStyles()

  return (
    <>
      <Card elevation={15}>
        <CardContent>
          <Typography color="textPrimary" variant="h1">
            MIT CityScope
          </Typography>

          <Divider className={classes.divider} light />

          <Typography color="textPrimary" variant="h4">
            MIT CityScope is an open-source urban modeling and simulation
            platform. CityScope allows users to examine different design
            alternatives, and observe their impact through multiple layers of
            urban analytics modules, such as traffic models, ABM simulation,
            urban access, economy, storm-water, noise and more.
          </Typography>
        </CardContent>
      </Card>

      <Divider className={classes.divider} light />

      <Card elevation={15}>
        <CardContent position={'bottom'}>
          <Typography color="textPrimary" gutterBottom>
            MIT CityScopeJS open-source project is developed by MIT, the City
            Science Network, and contributers from all over the world.
          </Typography>

          <Typography>
            <Link
              color={'secondary'}
              href={'https://github.com/CityScope'}
              target={'blank'}
            >
              <GitHubIcon fontSize={'small'} /> Join the CityScope open-source
              development
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Divider className={classes.divider} light />

      <Card elevation={15}>
        <CardContent position={'bottom'}>
          <Typography color="textPrimary" gutterBottom>
            Map view is provided via CityIO, CityScope server.
          </Typography>
          <Typography>
            <Link
              color={'secondary'}
              href={'https://github.com/CityScope/CS_CityIO'}
              target={'blank'}
            >
              <GitHubIcon fontSize={'small'} />{' '}
              https://github.com/CityScope/CS_CityIO
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Divider className={classes.divider} light />

      <Card elevation={15}>
        <CardContent position={'bottom'}>
          <GetGITdate />
        </CardContent>
      </Card>
    </>
  )
}
