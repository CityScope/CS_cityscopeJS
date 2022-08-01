import { useEffect, useState } from "react";
import axios from "axios";
import cityIOSettings from "../settings/settings";
import { Button } from "@mui/material";

export default function TableNameInput({ setSelectedTable }) {
  const [tableList, setTableList] = useState();

  useEffect(() => {
    /**
     * Gets all tables on init
     */
    let buttonsArr = [];
    const cityIOlistURL =
      cityIOSettings.cityIO.baseURL + cityIOSettings.cityIO.ListOfTables;
    const cityIOtableBaseUrl = cityIOSettings.cityIO.baseURL + "table/";

    axios.get(cityIOlistURL).then((res) => {
      res.data.forEach((tableName) => {
        const geogridUrl = `${cityIOtableBaseUrl}${tableName}/GEOGRID/`;
        buttonsArr.push(
          <Button
            key={Math.random()}
            variant="outlined"
            onClick={() => {
              axios
                .get(geogridUrl)
                .then((res) => {
                  if (res.status === 200) {
                    setSelectedTable(tableName);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            {tableName}
          </Button>
        );
      });
      setTableList(buttonsArr);
    });
  }, [setSelectedTable]);
  return <div>{tableList}</div>;
}
