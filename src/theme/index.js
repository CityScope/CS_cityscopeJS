import { createMuiTheme, colors } from '@material-ui/core'
import typography from './typography'

const theme = createMuiTheme({
  zIndex: {
    appBar: 999,
  },
  palette: {
    background: {
      default: '#ff5278', //255, 82, 120
      paper: '#18191a',
      dark: '#ff5278',
    },
    primary: {
      main: '#FFF',
      light: '#ff5278',
    },
    secondary: {
      main: '#ff5278',
    },

    text: {
      primary: colors.grey[100],
      secondary: '#ff5278',
    },
  },

  typography,
  shape: {
    borderRadius: 20,
  },

  overrides: {
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: '#18191a',
          boxShadow:
            '12px 12px 16px 0 rgba(0,0,0),-8px -8px 12px 0 rgba(40,41,42)',
          '&:hover': {
            backgroundColor: '#ff5278',
          },
        },
      },
      button: {
        '&:hover': {
          backgroundColor: '#ff5278',
        },
      },
    },

    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: '#ff5278',
      },
    },
    MuiAppBar: {
      colorPrimary: { backgroundColor: '#18191a', color: '#FFF' },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#FFF',
        opacity: 0.1,
      },
    },
    MuiCard: {
      root: {
        boxShadow:
          '12px 12px 16px 0 rgba(0,0,0),-8px -8px 12px 0 rgba(40,41,42)',
      },
    },
    MuiButton: {
      root: {
        boxShadow:
          '12px 12px 16px 0 rgba(0,0,0),-8px -8px 12px 0 rgba(40,41,42)',
        '&:hover': {
          boxShadow: '12px 12px 16px 0  #000,-2px -2px 16px 0  #ff5278',
        },
        // width: "100%",
      },
    },
  },
})

export default theme
