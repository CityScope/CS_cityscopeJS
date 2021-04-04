import {
  Container,
  Divider,
  Typography,
  makeStyles,
  Card,
  Link,
  CardContent,
} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import GetGITdate from './GetGITdate'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  gridCell: { textAlign: 'left' },
  divider: {
    margin: theme.spacing(3),
  },
}))
export default function SplashScreen() {
  const classes = useStyles()

  return (
    <Container>
      <Typography color="textPrimary" variant="h1">
        MIT CityScope
      </Typography>

      <Divider className={classes.divider} light />

      <Typography color="textPrimary" variant="h5">
        MIT CityScope is an open-source urban modeling and simulation platform.
        CityScope allows users to examine different design alternatives, and
        observe their impact through multiple layers of urban analytics modules,
        such as traffic models, ABM simulation, urban access, economy,
        storm-water, noise and more.
      </Typography>
      <Divider className={classes.divider} light />

      <Card>
        <CardContent>
          <Typography color="textPrimary" gutterBottom>
            MIT CityScopeJS open-source project is developed by MIT, the City
            Science Network, and contributers from all over the world.
          </Typography>
          <Typography>
            <Link
              variant={'caption'}
              color={'secondary'}
              href={'https://github.com/CityScope'}
              target={'blank'}
            >
              <GitHubIcon fontSize={'small'} /> Join the CityScope open-source
              development
            </Link>
          </Typography>
          <GetGITdate />
        </CardContent>
      </Card>

      <Divider className={classes.divider} light />
    </Container>
  )
}
