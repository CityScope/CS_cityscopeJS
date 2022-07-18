import { useState, useEffect } from "react";
import CityIO from "./CityIO";
import CityIOviewer from "../CityIOviewer";
import CSjsMain from "./CSjsMain";
import { useSelector, useDispatch } from "react-redux";
import { updateCityIOtableName } from "../../redux/reducers/cityIOdataSlice";
import GridEditor from "../GridEditor";
import queryString from "query-string";

export default function CityScopeJS() {
  const dispatch = useDispatch();

  const [tableName, setTableName] = useState();
  const [viewSelectorState, setViewSelectorState] = useState();
  // on init, get the adress URL to search for  a table
  useEffect(() => {
    const location = window.location;
    const parsed = queryString.parse(location.search);

    //a switch for the location.search and the parsed.tableName
    switch (Object.keys(parsed)[0]) {
      case "cityscope":
        // check if this location has a tableName
        const cityIOtableName =
          Object.values(parsed)[0] && Object.values(parsed)[0].toLowerCase();
        // check if tableName is a valid tableName
        if (cityIOtableName && cityIOtableName !== "") {
          setTableName(cityIOtableName);
          dispatch(updateCityIOtableName(cityIOtableName));
          setViewSelectorState("cityscopejs");
        } else {
          setViewSelectorState("cityio");
        }
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

  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      {/* if we got a cityIO table name, start cityIO module */}
      {tableName && <CityIO tableName={tableName} />}
      {/* if cityIO module is done loading, start the CSjs app */}
      {cityIOisDone && <CSjsMain tableName={tableName} />}
      {/* otherwise show the editor  */}
      {viewSelectorState === "grideditor" && <GridEditor />}
      {/* otherwise, show the cityIOviewer */}
      {viewSelectorState === "cityio" && <CityIOviewer />}
    </>
  );
}
