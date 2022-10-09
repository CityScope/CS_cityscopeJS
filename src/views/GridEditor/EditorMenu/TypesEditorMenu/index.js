import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { randomInt, randomUserName } from "@mui/x-data-grid-generator";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const columns = [
  { field: "id" },
  { field: "username", width: 150, editable: true },
  { field: "age", width: 80, type: "number" },
  { field: "blod", width: 200 },
];

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return {
    id: idCounter,
    username: randomUserName(),
    age: randomInt(10, 80),
    blod: randomUserName() / 2,
  };
};

export default function TypesEditorMenu() {
  const [rows, setRows] = React.useState(() => [
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
  ]);

  console.log(rows);

  const handleUpdateRow = () => {
    setRows((prevRows) => {
      const rowToUpdateIndex = randomInt(0, rows.length - 1);

      return prevRows.map((row, index) =>
        index === rowToUpdateIndex
          ? { ...row, username: randomUserName() }
          : row
      );
    });
  };

  const handleUpdateAllRows = () => {
    setRows(rows.map((row) => ({ ...row, username: randomUserName() })));
  };

  const handleDeleteRow = () => {
    setRows((prevRows) => {
      const rowToDeleteIndex = randomInt(0, prevRows.length - 1);
      return [
        ...rows.slice(0, rowToDeleteIndex),
        ...rows.slice(rowToDeleteIndex + 1),
      ];
    });
  };

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, createRandomRow()]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleUpdateRow}>
          Update a row
        </Button>
        <Button size="small" onClick={handleUpdateAllRows}>
          Update all rows
        </Button>
        <Button size="small" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ height: "100vh", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Box>
  );
}

// import MaterialTable from "@material-table/core";
// import { useState, useEffect } from "react";
// import { Typography } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { GridEditorSettings } from "../../../../settings/settings";
// import { updateTypesEditorState } from "../../../../redux/reducers/editorMenuSlice";

// const settings = GridEditorSettings;

// export const createTypesArray = (LandUseTypesList) => {
//   let typesArray = [];
//   Object.keys(LandUseTypesList).forEach((type, index) => {
//     typesArray.push({
//       id: index,
//       name: type,
//       description: "[edit info for type: " + type + "]",
//       color: LandUseTypesList[type].color,
//       height: LandUseTypesList[type].height ? LandUseTypesList[type].height : [0,0,0],

//       LBCS: LandUseTypesList[type].LBCS
//         ? JSON.stringify(LandUseTypesList[type].LBCS)
//         : null,
//       NAICS: LandUseTypesList[type].NAICS
//         ? JSON.stringify(LandUseTypesList[type].NAICS)
//         : null,
//       interactive: LandUseTypesList[type].interactive,
//     });
//   });
//   return typesArray;
// };

// export const tableInitialState = {
//   columns: [
//     {
//       title: "Type",
//       field: "name",
//     },
//     {
//       title: "Description",
//       field: "description",
//     },

//     {
//       title: "Height Min.",
//       field: "height[0]",
//       type: "numeric",
//     },
//     {
//       title: "Height Default",
//       field: "height[1]",
//       type: "numeric",
//     },
//     {
//       title: "Height Max.",
//       field: "height[2]",
//       type: "numeric",
//     },
//     {
//       title: "Interactive",
//       field: "interactive",
//       lookup: { No: "No", Web: "Web", TUI: "TUI" },
//     },
//     {
//       title: "Color",
//       field: "color",
//       type: "string",
//     },
//     {
//       title: "LBCS",
//       field: "LBCS",
//       type: "string",
//     },
//     {
//       title: "NAICS",
//       field: "NAICS",
//       type: "string",
//     },
//   ],
//   data: createTypesArray(settings.GEOGRID.properties.types),
// };

// export default function TypesEditorMenu() {
//   const [tableState, setTableState] = useState(tableInitialState);
//   const dispatch = useDispatch();
//   const [selectedRow, setSelectedRow] = useState();
//   const [rowColor, setRowColor] = useState();

//   // redux the type list on every change
//   useEffect(() => {
//     dispatch(
//       updateTypesEditorState({
//         tableData: tableState.data,
//         selectedRow: selectedRow,
//         rowColor: rowColor,
//       })
//     );
// eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tableState, selectedRow, rowColor]);

//   return (
//     <MaterialTable
//       title={<Typography variant="h4">Types Editor</Typography>}
//       columns={tableState.columns}
//       data={tableState.data}
//       options={{
//         paging: false,
//         search: true,
//         selection: false,
//         rowStyle: (rowData) => ({
//           backgroundColor:
//             selectedRow && selectedRow.tableData.id === rowData.tableData.id
//               ? rowColor
//               : null,

//           color:
//             selectedRow && selectedRow.tableData.id === rowData.tableData.id
//               ? "black"
//               : "white",
//         }),
//       }}
//       onRowClick={(evt, row) => {
//         setSelectedRow(row);
//         setRowColor(row.color);
//       }}
//       editable={{
//         // ! new row is added to the end of the table
//         onRowAdd: (newData) =>
//           new Promise((resolve) => {
//             resolve();
//             setTimeout(() => {
//               setTableState((prevState) => {
//                 const data = [...prevState.data];
//                 newData.id = data.length;
//                 data.push(newData);
//                 return { ...prevState, data };
//               });
//             }, 50);
//           }),
//         // ! row edit is done by clicking on the row
//         onRowUpdate: (newData, oldData) =>
//           new Promise((resolve) => {
//             resolve();
//             setTimeout(() => {
//               if (oldData) {
//                 setTableState((prevState) => {
//                   const tableData = [...prevState.data];
//                   const index = tableData
//                     .map((object) => object.id)
//                     .indexOf(oldData.id);
//                   tableData[index] = newData;
//                   return { ...prevState, data: tableData };
//                 });
//               }
//             }, 50);
//           }),
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
//       }}
//     />
//   );
// }
