import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SelectedTable from "./SelectedTable";
import { useState } from "react";
export default function SearchTablesList(props) {
  const tablesList = props.tablesList;
  const [selectedTable, setSelectedTable] = useState(null);
  const defaultProps = {
    options: tablesList,
    getOptionLabel: (option) => option.tableName,
  };

  return (
    <>
      {selectedTable && <SelectedTable clicked={selectedTable} />}
      <Autocomplete
        {...defaultProps}
        disablePortal
        id="combo-box-demo"
        options={tablesList}
        sx={{ width: '20svw', minWidth: '250px', marginTop: 1 }}
        renderInput={(params) => <TextField {...params} InputLabelProps={{sx: {fontSize:15}}} label="Search CityScope Project..." />}
        onChange={(event, newValue) => {
          setSelectedTable(newValue);
        }}
      />
    </>
  );
}
