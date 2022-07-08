import CityScopeJS from "./views/CityScopeJS";
import { CssBaseline } from "@mui/material/";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CityScopeJS />
    </ThemeProvider>
  );
};

export default App;
