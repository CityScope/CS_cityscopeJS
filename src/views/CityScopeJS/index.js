import { useState, useEffect } from "react";
import CityIO from "./CityIO";
import CityIOviewer from "../CityIOviewer";
import CSjsMain from "./CSjsMain";
import LoadingSpinner from "../../Components/LoadingSpinner";

export default function CityScopeJS() {
  // get the table name for cityIO comp
  const [tableName, setTableName] = useState("cityscopejs");

  // on init, get the adress URL
  // to search for  a table
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

  return (
    <>
      <LoadingSpinner loadingModules={loadingModules} />
      {tableName && <CityIO tableName={tableName} />}
      {tableName && <CSjsMain tableName={tableName} />}
      {!tableName && <CityIOviewer />}
    </>
  );
}
