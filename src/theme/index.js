import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {
    mode: "dark",
    primary: {
      main: "#FFF",
      light: "#2196f3",
    },
    secondary: {
      main: "#2196f3",
    },
    text: {
      primary: "#FFF",
      secondary: "#2196f3",
    },
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "#2196f3",
      },
    },
  },
});

export default theme;
