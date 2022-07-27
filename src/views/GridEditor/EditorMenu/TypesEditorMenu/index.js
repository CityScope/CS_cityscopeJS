import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { GridEditorSettings } from "../../../../settings/gridEditorSettings";
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
    dispatch(
      updateTypesEditorState({
        tableData: tableState.data,
        selectedRow: selectedRow,
        rowColor: rowColor,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            }, 1000);
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
            }, 1000);
          }),
        // ! row delete is done by clicking on the icon
        // onRowDelete: (oldData) => {
        //   new Promise((resolve) => {
        //     resolve();
        //     setTimeout(() => {
        //       if (oldData) {
        //         setTableState((prevState) => {
        //           const tableData = [...prevState.data];
        //           const index = tableData
        //             .map((object) => object.id)
        //             .indexOf(oldData.id);
        //           tableData.splice(index, 1);
        //           return { ...prevState, data: tableData };
        //         });
        //       }
        //     }, 1000);
        //   });
        // },
      }}
    />
  );
}
