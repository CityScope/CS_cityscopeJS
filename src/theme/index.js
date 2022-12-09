import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {
    mode: "dark",
    primary: {
      main: "#eaf5fe",
      light: "#42a5f5",
      dark: "#074a80",
    },
    secondary: {
      main: "#42a5f5",
      dark: "#021423",
    },
    text: {
      primary: "#f1f8fe",
      secondary: "#297fc5",
    },
  },
  shape: {
    borderRadius: 20,
  },
  // change the default style of the Mui paper component
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#021423",
        },
      },
    },
  },
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "#42a5f5",
      },
    },
  },
});

export default theme;
