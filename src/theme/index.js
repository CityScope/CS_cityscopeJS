import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {

    mode: "dark",
    primary: {
      main: "#FFF",
      light: "#006ea0",
    },
    secondary: {
      main: "#006ea0",
    },
    text: {
      primary: "#FFF",
      secondary: "#006ea0",
    },
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "#006ea0",
      },
    },
  },
});

export default theme;
