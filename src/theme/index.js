import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {
    mode: "dark",
    primary: {
      main: "#FFF",
      light: "#ff5278",
    },
    secondary: {
      main: "#ff5278",
    },
    text: {
      primary: "#fff",
      secondary: "#ff5278",
    },
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "#ff5278",
      },
    },
  },
});

export default theme;
