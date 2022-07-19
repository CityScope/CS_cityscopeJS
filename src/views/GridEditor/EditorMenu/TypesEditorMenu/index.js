// import MaterialTable from "@material-table/core";
// import { useState, useEffect } from "react";
// import { Typography } from "@mui/material";
// import { useDispatch } from "react-redux";
// import { GridEditorSettings } from "../../../../settings/gridEditorSettings";

// export default function TypesEditorMenu() {
//   const settings = GridEditorSettings;

//   const createTypesArray = (LanduseTypesList) => {
//     let typesArray = [];
//     Object.keys(LanduseTypesList).forEach((type) => {
//       typesArray.push({
//         name: type,
//         description: "[edit info for type: " + type + "]",
//         color: LanduseTypesList[type].color,
//         height: LanduseTypesList[type].height
//           ? LanduseTypesList[type].height
//           : 0,

//         LBCS: LanduseTypesList[type].LBCS
//           ? JSON.stringify(LanduseTypesList[type].LBCS)
//           : null,
//         NAICS: LanduseTypesList[type].NAICS
//           ? JSON.stringify(LanduseTypesList[type].NAICS)
//           : null,
//         interactive: LanduseTypesList[type].interactive,
//       });
//     });
//     return typesArray;
//   };

//   const [state, setState] = useState({
//     columns: [
//       {
//         title: "Type",
//         field: "name",
//       },
//       {
//         title: "Description",
//         field: "description",
//       },

//       {
//         title: "Height",
//         field: "height",
//         type: "numeric",
//       },
//       {
//         title: "Interactive",
//         field: "interactive",
//         lookup: { No: "No", Web: "Web", TUI: "TUI" },
//       },
//       {
//         title: "Color",
//         field: "color",
//         type: "string",
//       },
//       {
//         title: "LBCS",
//         field: "LBCS",
//         type: "string",
//       },
//       {
//         title: "NAICS",
//         field: "NAICS",
//         type: "string",
//       },
//     ],
//     data: createTypesArray(settings.GEOGRID.properties.types),
//   });

//   const dispatch = useDispatch();
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [rowColor, setRowColor] = useState(null);

//   // redux the type list on every change
//   useEffect(() => {
//     //! dispatch(listeonToTypesList(state.data));
//   });

//   return (
//     <MaterialTable
//       title={<Typography variant="h2">Types Editor</Typography>}
//       columns={state.columns}
//       data={state.data}
//       options={{
//         paging: false,
//         search: true,
//         selection: false,
//         rowStyle: (rowData) => ({
//           backgroundColor:
//             selectedRow === rowData.tableData.id ? rowColor : null,
//         }),
//       }}
//       onRowClick={(evt, row) => {
//         setSelectedRow(row.tableData.id);
//         setRowColor(row.color);
//         //! dispatch(listenToRowEdits(row));
//       }}
//       editable={{
//         onRowAdd: (newData) =>
//           new Promise((resolve) => {
//             setTimeout(() => {
//               resolve();
//               setState((prevState) => {
//                 const data = [...prevState.data];
//                 data.push(newData);
//                 return { ...prevState, data };
//               });
//             }, 200);
//           }),
//         onRowUpdate: (newData, oldData) =>
//           new Promise((resolve) => {
//             setTimeout(() => {
//               resolve();
//               if (oldData) {
//                 setState((prevState) => {
//                   const data = [...prevState.data];
//                   data[data.indexOf(oldData)] = newData;

//                   return { ...prevState, data };
//                 });
//               }

//               // dispatch change to redux
//               //! dispatch(listenToRowEdits(newData));
//             }, 200);
//           }),
//         onRowDelete: (oldData) =>
//           new Promise((resolve) => {
//             console.log(oldData);

//             setTimeout(() => {
//               resolve();
//               setState((prevState) => {
//                 const data = [...prevState.data];
//                 data.splice(data.indexOf(oldData), 1);
//                 return { ...prevState, data };
//               });

//               //! dispatch(listenToGridCreator(null));
//             }, 200);
//           }),
//       }}
//     />
//   );
// }

import React from "react";
import MaterialTable from "@material-table/core";

const lookup = { true: "Available", false: "Unavailable" };

const columns = [
  { title: "First Name", field: "firstName" },
  { title: "Last Name", field: "lastName" },
  { title: "Birth Year", field: "birthYear", type: "numeric" },
  { title: "Availablity", field: "availability", lookup },
];

const data = [
  { firstName: "Tod", lastName: "Miles", birthYear: 1987, availability: true },
  {
    firstName: "Jess",
    lastName: "Smith",
    birthYear: 2000,
    availability: false,
  },
];

export default function TypesEditorMenu() {
  return <MaterialTable columns={columns} data={data} />;
}
