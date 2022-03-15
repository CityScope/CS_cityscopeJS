import { useState, useEffect } from "react";
import CityIO from "./CityIO";
import CityIOviewer from "../CityIOviewer";
import CSjsMain from "./CSjsMain";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useSelector } from "react-redux";

export default function CityScopeJS() {
  // get the table name for cityIO comp
  const testTableName = "tanthuan_a0b0c1d0";
  const [tableName, setTableName] = useState();

  // on init, get the adress URL to search for  a table
  useEffect(() => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url
      .substring(url.indexOf(pre) + pre.length)
      .toLowerCase();

    // check URL for proper CS project link
    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
      setTableName(cityscopePrjName);
    }
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
      {!tableName && <CityIOviewer />}
    </>
  );
}
