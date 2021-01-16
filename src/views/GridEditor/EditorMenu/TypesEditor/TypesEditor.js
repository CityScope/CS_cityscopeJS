import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import {
    listenToRowEdits,
    listeonToTypesList,
} from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import settings from "../../GridEditorSettings.json";

export default function TypesEditor() {
    const createtypesArray = (LanduseTypesList) => {
        let typesArray = [];
        Object.keys(LanduseTypesList).forEach((type) => {
            typesArray.push({
                name: type,
                color: LanduseTypesList[type].color,
                height: LanduseTypesList[type].height
                    ? LanduseTypesList[type].height
                    : 0,

                LBCS: LanduseTypesList[type].LBCS
                    ? JSON.stringify(LanduseTypesList[type].LBCS)
                    : null,
                NAICS: LanduseTypesList[type].NAICS
                    ? JSON.stringify(LanduseTypesList[type].NAICS)
                    : null,
                interactive: LanduseTypesList[type].interactive,
            });
        });
        return typesArray;
    };

    const [state, setState] = React.useState({
        columns: [
            { title: "Type", field: "name" },
            { title: "Height", field: "height", type: "numeric" },
            {
                title: "Interactive",
                field: "interactive",
                lookup: { No: "No", Web: "Web", TUI: "TUI" },
            },
            { title: "Color", field: "color", type: "string" },
            { title: "LBCS", field: "LBCS", type: "string" },
            { title: "NAICS", field: "NAICS", type: "string" },
        ],
        data: createtypesArray(settings.GEOGRID.properties.types),
    });

    const dispatch = useDispatch();
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowColor, setRowColor] = useState(null);

    // redux the type list on every change
    useEffect(() => {
        dispatch(listeonToTypesList(state.data));
    });

    return (
        <div style={{ maxWidth: "100%" }}>
            <Grid container>
                <Grid item xs={12}>
                    <MaterialTable
                        title="Types Editor"
                        columns={state.columns}
                        data={state.data}
                        options={{
                            paging: false,
                            search: false,
                            selection: false,
                            rowStyle: (rowData) => ({
                                backgroundColor:
                                    selectedRow === rowData.tableData.id
                                        ? rowColor
                                        : null,
                            }),
                        }}
                        onRowClick={(evt, row) => {
                            setSelectedRow(row.tableData.id);
                            setRowColor(row.color);
                            dispatch(listenToRowEdits(row));
                        }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data.push(newData);
                                            return { ...prevState, data };
                                        });
                                    }, 50);
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        if (oldData) {
                                            setState((prevState) => {
                                                const data = [
                                                    ...prevState.data,
                                                ];
                                                data[
                                                    data.indexOf(oldData)
                                                ] = newData;

                                                return { ...prevState, data };
                                            });
                                        }

                                        // dispath change to redux
                                        dispatch(listenToRowEdits(newData));
                                    }, 50);
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data.splice(
                                                data.indexOf(oldData),
                                                1
                                            );
                                            return { ...prevState, data };
                                        });
                                    }, 50);
                                }),
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
