import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {

    mode: "dark",
    primary: {
      main: "#FFF",
      light: "#808080",
    },
    secondary: {
      main: "#808080",
    },
    text: {
      primary: "#FFF",
      secondary: "#808080",
    },
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "#808080",
      },
    },
  },
});

export default theme;
