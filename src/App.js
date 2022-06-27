import CityScopeJS from "./views/CityScopeJS";
import { CssBaseline } from "@mui/material/";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CityScopeJS />
    </ThemeProvider>
  );
};

export default App;
