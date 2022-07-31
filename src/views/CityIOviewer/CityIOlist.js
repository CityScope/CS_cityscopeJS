import { useEffect, useState } from "react";
import CityIOdeckGLmap from "./CityIOdeckGLmap/index";
import TableListLoading from "./TableListLoading";

import axios from "axios";
import {cityIOSettings} from "../../settings/settings";

export default function CityIOlist() {
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCityIOtables = async () => {
    // ! https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
    const cityIOlistURL = cityIOSettings.cityIO.ListOfTables;
    // get all URLs
    const tablesArr = await axios.get(cityIOlistURL);
    // create array of all requests
    const requestArr = tablesArr.data.map(async (tableName) => {
      // const tableName = urlStr.split('/').pop()
      const url = `${cityIOSettings.cityIO.baseURL}table/${tableName}/`;
      return axios
        .get(`${url}GEOGRID/properties/header/`)
        .then((res) =>
          setTableList((oldArray) => [
            ...oldArray,
            { tableURL: url, tableName: tableName, tableHeader: res.data },
          ])
        )
        .catch((error) => console.log(error.toString()));
    });

    Promise.all(requestArr).then(() => {
      setIsLoading(false);
      return tableList;
    });
  };

  useEffect(() => {
    fetchCityIOtables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {<CityIOdeckGLmap cityIOdata={tableList} isLoading={isLoading} />}
      {isLoading && <TableListLoading />}
    </>
  );
}
