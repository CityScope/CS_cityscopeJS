import PropTypes from 'prop-types'
import GitHubIcon from '@material-ui/icons/GitHub'
import FormatShapesIcon from '@material-ui/icons/FormatShapes'
import {
  Box,
  Drawer,
  Fab,
  List,
  Typography,
  makeStyles,
  Card,
  CardContent,
} from '@material-ui/core'
import { BarChart as BarChartIcon, Map as MapIcon } from 'react-feather'
import NavItem from './NavItem'

const items = [
  {
    href: '/',
    icon: MapIcon,
    title: 'CityScopeJS',
  },
  {
    href: '/editor',
    icon: BarChartIcon,
    title: 'Grid Editor',
  },
  {
    href: '/projection',
    icon: FormatShapesIcon,
    title: 'Projection Mapping',
  },
]

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: '30vw',
    top: 48,
    height: 'calc(100% - 48px)',
    boxShadow: '22px 22px 22px 0 rgba(0,0,0)',
  },
}))

const NavBar = ({ openNavDrawer, onMobileNavOpen }) => {
  const classes = useStyles()

  const content = (
    <Box height="100%" display="flex" flexDirection="column" p={3}>
      <List>
        {items.map((item) => (
          <NavItem
            style={{ padding: '2vh' }}
            href={item.href}
            key={item.title}
            title={item.title}
            icon={item.icon}
            onClick={onMobileNavOpen}
          />
        ))}
      </List>

      <Box flexGrow={1} />
      <Card elevation={5} p={2}>
        <CardContent position={'bottom'}>
          <Fab
            href="http://github.com/CityScope/CS_cityscopeJS/"
            color="default"
            size="small"
          >
            <GitHubIcon />
          </Fab>
          <Box p={2} />
          <Typography align="left" variant="h5">
            MIT CityScope
          </Typography>
          <Typography align="left" variant="caption">
            {new Date().getFullYear()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )

  return (
    <>
      <Drawer
        anchor="left"
        classes={{ paper: classes.mobileDrawer }}
        open={openNavDrawer}
        elevation={10}
        variant="persistent"
      >
        {content}
      </Drawer>
    </>
  )
}

NavBar.propTypes = {
  onMobileNavOpen: PropTypes.func,
  openNavDrawer: PropTypes.bool,
}

NavBar.defaultProps = {
  onMobileClose: () => {},
  openNavDrawer: false,
}

export default NavBar
