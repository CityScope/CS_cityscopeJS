import {
  Container,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box,
} from '@material-ui/core'
import CityIOlist from './CityIOlist'
import Page from '../../layouts/Page'

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
        <Container maxWidth={false}>
          <Card
            elevation={15}
            style={{ position: 'fixed', zIndex: 100, margin: 50 }}
          >
            <Box spacing={1} p={1} m={1}>
              <Typography color="textPrimary" variant="h1">
                Projects Map
              </Typography>
              <Box mt={'3em'} />
              <Typography color="textPrimary">
                List of current CityScope projects around the world.
              </Typography>
            </Box>
          </Card>

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
        </Container>
      </Page>
    </>
  )
}
