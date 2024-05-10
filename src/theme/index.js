import typography from "./typography";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography,
  palette: {
    mode: "dark",
  },
});

export default theme;
