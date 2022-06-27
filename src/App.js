import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./theme/GlobalStyles";
import theme from "./theme";
import CityScopeJS from "./views/CityScopeJS";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CityScopeJS />
    </ThemeProvider>
  );
};

export default App;
