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
    const cityIOlistURL =
      cityIOSettings.cityIO.baseURL + cityIOSettings.cityIO.headers;
    // get all table headers
    let tablesArr = await axios.get(cityIOlistURL);
    // create array of all headers
    tablesArr = tablesArr.data.map(table => {
      const url = `${cityIOSettings.cityIO.baseURL}table/${table.tableName}/`;
      table = {...table, tableURL: url}
      return table
    })
    setTableList((oldArray) => [...tablesArr]);
    setIsLoading(false);
};

  useEffect(() => {
    fetchCityIOtables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{isLoading && <TableListLoading />}</>;
}
