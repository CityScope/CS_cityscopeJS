import { useState, useEffect } from "react";
import CityIO from "./CityIO";
import CityIOviewer from "../CityIOviewer";
import CSjsMain from "./CSjsMain";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { updateCityIOtableName } from "../../redux/reducers/cityIOdataSlice";

export default function CityScopeJS() {
  const dispatch = useDispatch();
  // get the table name for cityIO comp
  // const testTableName = "corktown";
  // const testTableName = "tanthuan_a0b0c1d0";
  const [tableName, setTableName] = useState();
  const [cityIOviewer, setCityIOviewer] = useState(false);
  // on init, get the adress URL to search for  a table
  useEffect(() => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityIOtableName = url
      .substring(url.indexOf(pre) + pre.length)
      .toLowerCase();

    // check URL for proper CS project link
    if (url.indexOf(pre) !== -1 && cityIOtableName.length > 0) {
      setTableName(cityIOtableName);
      dispatch(updateCityIOtableName(cityIOtableName));
    } else {
      setCityIOviewer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loadingModules, setLoadingModules] = useState([]);
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  return (
    <>
      <LoadingSpinner loadingModules={loadingModules} />
      {tableName && <CityIO tableName={tableName} />}
      {cityIOisDone && <CSjsMain tableName={tableName} />}
      {cityIOviewer && <CityIOviewer />}
    </>
  );
}
