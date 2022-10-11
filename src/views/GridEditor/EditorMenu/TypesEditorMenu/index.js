import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { GridEditorSettings } from "../../../../settings/settings";
import { updateTypesEditorState } from "../../../../redux/reducers/editorMenuSlice";
import { createTypesArray, tableInitialState } from "./utils";

const settings = GridEditorSettings;

export default function TypesEditorMenu() {
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState();
  const [rowColor, setRowColor] = useState();

  const [typesTableRows, setTypesTableRows] = useState(() =>
    createTypesArray(settings.GEOGRID.properties.types)
  );

  const handleDeleteRow = () => {
    setTypesTableRows((prevRows) => {
      const rowToDeleteIndex = prevRows.length - 1;
      return [...typesTableRows.slice(0, rowToDeleteIndex)];
    });
  };

  const handleAddRow = () => {
    const newRow = {};
    // make sure the new row copies from existing row
    if (!typesTableRows[0]) return {};
    for (const key in typesTableRows[0]) {
      if (key === "id") {
        // add a new id to the new row
        newRow[key] = typesTableRows.length + 1;
      } else {
        newRow[key] = typesTableRows[0][key];
      }
    }
    setTypesTableRows((prevRows) => [...prevRows, newRow]);
  };

  // redux the type list on every change
  useEffect(() => {
    dispatch(
      updateTypesEditorState({
        tableData: typesTableRows,
        selectedRow: selectedRow,
        rowColor: rowColor,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typesTableRows, selectedRow]);

  return (
    <>
      <Box sx={{ width: "100%", p: 1 }}>
        <Typography variant="h4">1. Types Properties</Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" variant="outlined" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ mt: 1 }}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: rowColor && rowColor,
          }}
          autoHeight
          rowHeight={50}
          rows={typesTableRows}
          columns={tableInitialState}
          // experimentalFeatures={{ newEditingApi: true }}
          onSelectionModelChange={(ids) => {
            setSelectedRow(typesTableRows[ids]);
            setRowColor(typesTableRows[ids].color);
          }}
          onCellEditCommit={(params) => {
            setTypesTableRows((prevRows) => {
              const updatedRows = [...prevRows];
              // find the row that was edited using the id field
              const rowToEditIndex = updatedRows.findIndex(
                (row) => row.id === params.id
              );
              // update the row
              updatedRows[rowToEditIndex] = {
                ...updatedRows[rowToEditIndex],
                [params.field]: params.value,
              };
              console.log(updatedRows);
              return updatedRows;
            });
          }}
        />
      </Box>
    </>
  );
}
