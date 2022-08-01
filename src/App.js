import CityScopeJS from "./views/CityScopeJS";
import { CssBaseline } from "@mui/material/";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { useState, useEffect } from "react";
import CityIOviewer from "./views/CityIOviewer";
import ProjectionMapping from "./views/ProjectionMapping";
import { useDispatch } from "react-redux";
import { updateCityIOtableName } from "./redux/reducers/cityIOdataSlice";
import GridEditor from "./views/GridEditor";
import queryString from "query-string";

/**
get this tab URL and parse as a simple router to show the correct view
 **/

const App = () => {
  const dispatch = useDispatch();
  const [tableName, setTableName] = useState();

  // change the document title to the table name
  useEffect(() => {
    document.title = tableName ? `CityScopeJS | ${tableName}` : "CityScopeJS";
  }, [tableName]);

  const [viewSelectorState, setViewSelectorState] = useState();

  const selectView = (view) => {
    const parsed = queryString.parse(window.location.search);
    const cityIOtableName =
      Object.values(parsed)[0] && Object.values(parsed)[0].toLowerCase();
    // check if tableName is a valid tableName
    if (cityIOtableName && cityIOtableName !== "") {
      setTableName(cityIOtableName);
      dispatch(updateCityIOtableName(cityIOtableName));
      setViewSelectorState(view);
    } else {
      setViewSelectorState("cityio");
    }
  };

  // on init, get the adress URL to search for  a table
  useEffect(() => {
    const location = window.location;
    const parsed = queryString.parse(location.search);

    //a switch for the location.search and the parsed.tableName
    switch (Object.keys(parsed)[0]) {
      case "cityscope":
        selectView("cityscopejs");
        break;
      case "projection":
        // check if this location has a tableName
        selectView("projection");
        break;
      case "editor":
        // ! to get the table name for editing (not used yet)
        setViewSelectorState("grideditor");
        break;
      default:
        setViewSelectorState("cityio");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <>
        {/* otherwise show the editor  */}
        {viewSelectorState === "cityscopejs" && <CityScopeJS />}
        {/* otherwise show the editor  */}
        {viewSelectorState === "grideditor" && <GridEditor />}
        {/* otherwise, show the cityIOviewer */}
        {viewSelectorState === "cityio" && <CityIOviewer />}
        {/* otherwise, show the cityIOviewer */}
        {viewSelectorState === "projection" && <ProjectionMapping />}
      </>
    </ThemeProvider>
  );
};

export default App;
