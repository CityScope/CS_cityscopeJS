import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { GridEditorSettings } from "../../../../settings/settings";
import { updateTypesEditorState } from "../../../../redux/reducers/editorMenuSlice";

const settings = GridEditorSettings;

export const createTypesArray = (LandUseTypesList) => {
  let typesArray = [];
  Object.keys(LandUseTypesList).forEach((type, index) => {
    typesArray.push({
      id: index,
      name: type,
      description: "[edit info for type: " + type + "]",
      color: LandUseTypesList[type].color,
      height: LandUseTypesList[type].height,
      "height[0]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[0]
        : 0,
      "height[1]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[1]
        : 0,
      "height[2]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[2]
        : 0,

      LBCS: LandUseTypesList[type].LBCS
        ? JSON.stringify(LandUseTypesList[type].LBCS)
        : null,
      NAICS: LandUseTypesList[type].NAICS
        ? JSON.stringify(LandUseTypesList[type].NAICS)
        : null,
      interactive: LandUseTypesList[type].interactive,
    });
  });
  return typesArray;
};

export const tableInitialState = [
  {
    field: "name",
    headerName: "Type Name",
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    editable: true,
  },

  {
    field: "height[0]",
    headerName: "Height [0]",
    type: "number",
    editable: true,
  },
  {
    field: "height[1]",
    headerName: "Height [1]",
    type: "number",
    editable: true,
  },
  {
    field: "height[2]",
    headerName: "Height [2]",

    type: "number",
    editable: true,
  },
  {
    field: "interactive",
    headerName: "Interactive",
    type: "singleSelect",
    valueOptions: ["No", "Web", "TUI"],
    editable: true,
  },
  {
    field: "color",
    headerName: "Color",
    type: "string",
    editable: true,
  },
  {
    field: "LBCS",
    type: "string",
    editable: true,
  },
  {
    field: "NAICS",
    type: "string",
  },
];

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
  }, [typesTableRows, selectedRow, rowColor]);

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
          autoHeight
          rowHeight={38}
          rows={typesTableRows}
          columns={tableInitialState}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </>
  );
}

/*

export default function TypesEditorMenu() {
  const [tableState, setTableState] = useState(tableInitialState);


  // redux the type list on every change
  useEffect(() => {
    dispatch(
      updateTypesEditorState({
        tableData: tableState.data,
        selectedRow: selectedRow,
        rowColor: rowColor,
      })
    );
eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState, selectedRow, rowColor]);

  return (
    <MaterialTable
      title={<Typography variant="h4">Types Editor</Typography>}
      columns={tableState.columns}
      data={tableState.data}
      options={{
        paging: false,
        search: true,
        selection: false,
        rowStyle: (rowData) => ({
          backgroundColor:
            selectedRow && selectedRow.tableData.id === rowData.tableData.id
              ? rowColor
              : null,

          color:
            selectedRow && selectedRow.tableData.id === rowData.tableData.id
              ? "black"
              : "white",
        }),
      }}
      onRowClick={(evt, row) => {
        setSelectedRow(row);
        setRowColor(row.color);
      }}
      editable={{
        // ! new row is added to the end of the table
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            resolve();
            setTimeout(() => {
              setTableState((prevState) => {
                const data = [...prevState.data];
                newData.id = data.length;
                data.push(newData);
                return { ...prevState, data };
              });
            }, 50);
          }),
        // ! row edit is done by clicking on the row
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            resolve();
            setTimeout(() => {
              if (oldData) {
                setTableState((prevState) => {
                  const tableData = [...prevState.data];
                  const index = tableData
                    .map((object) => object.id)
                    .indexOf(oldData.id);
                  tableData[index] = newData;
                  return { ...prevState, data: tableData };
                });
              }
            }, 50);
          }),
! row delete is done by clicking on the icon
onRowDelete: (oldData) => {
  new Promise((resolve) => {
    resolve();
    setTimeout(() => {
      if (oldData) {
        setTableState((prevState) => {
          const tableData = [...prevState.data];
          const index = tableData
            .map((object) => object.id)
            .indexOf(oldData.id);
          tableData.splice(index, 1);
          return { ...prevState, data: tableData };
        });
      }
    }, 1000);
  });
},
      }}
    />
  );
}

*/
