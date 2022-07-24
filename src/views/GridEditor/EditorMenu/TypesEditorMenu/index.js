import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { GridEditorSettings } from "../../../../settings/gridEditorSettings";
import { updateTypesEditorState } from "../../../../redux/reducers/editorMenuSlice";

const settings = GridEditorSettings;

export const createTypesArray = (LandUseTypesList) => {
  let typesArray = [];
  Object.keys(LandUseTypesList).forEach((type) => {
    typesArray.push({
      name: type,
      description: "[edit info for type: " + type + "]",
      color: LandUseTypesList[type].color,
      height: LandUseTypesList[type].height ? LandUseTypesList[type].height : 0,

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

export const tableInitialState = {
  columns: [
    {
      title: "Type",
      field: "name",
    },
    {
      title: "Description",
      field: "description",
    },

    {
      title: "Height",
      field: "height",
      type: "numeric",
    },
    {
      title: "Interactive",
      field: "interactive",
      lookup: { No: "No", Web: "Web", TUI: "TUI" },
    },
    {
      title: "Color",
      field: "color",
      type: "string",
    },
    {
      title: "LBCS",
      field: "LBCS",
      type: "string",
    },
    {
      title: "NAICS",
      field: "NAICS",
      type: "string",
    },
  ],
  data: createTypesArray(settings.GEOGRID.properties.types),
};

export default function TypesEditorMenu() {
  const [tableState, setTableState] = useState(tableInitialState);
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState();
  const [rowColor, setRowColor] = useState();

  // redux the type list on every change
  useEffect(() => {
    // console.log(tableState);
    // dispatch(updateTypesEditorState(tableState.data));
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
            selectedRow === rowData.tableData.id ? rowColor : null,
        }),
      }}
      onRowClick={(evt, row) => {
        setSelectedRow(row.tableData.id);
        setRowColor(row.color);
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setTableState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 200);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setTableState((prevState) => {
                  const data = [...prevState.data];
                  const index = data.map(object => object.name).indexOf(oldData.name);
                  console.log(index);
                  data[index] = newData;

                  return { ...prevState, data };
                });
              }
            }, 200);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setTableState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 200);
          }),
      }}
    />
  );
}
