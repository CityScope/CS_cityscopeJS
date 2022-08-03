import { useEffect, useState } from "react";
import TableListLoading from "./TableListLoading";
import axios from "axios";
import { cityIOSettings } from "../../settings/settings";

export default function CityIOlist(props) {
  const getTablesList = props.getTablesList;
  const [tablesList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tablesList && getTablesList(tablesList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablesList]);

  const fetchCityIOtables = async () => {
    // ! https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
    const cityIOlistURL =
      cityIOSettings.cityIO.baseURL + cityIOSettings.cityIO.ListOfTables;
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
      return tablesList;
    });
  };

  useEffect(() => {
    fetchCityIOtables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{isLoading && <TableListLoading />}</>;
}
