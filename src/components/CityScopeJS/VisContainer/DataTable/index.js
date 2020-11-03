import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";

export default function DataTable({ dataType }) {
    const [cityioData] = useSelector((state) => [state.CITYIO]);

    console.log("data", cityioData);
    const data = useMemo(
        () => cityioData[dataType].map((d, i) => ({ id: i + 1, ...d })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataType]
    );

    console.log("data", data);

    console.log(dataType);
    const columns = useMemo(
        () =>
            Object.keys(data[0]).map((d) => ({
                headerName: d,
                id: d,
                field: d,
                width:
                    d === "id"
                        ? 50
                        : d === "name"
                        ? 200
                        : d === "units"
                        ? 160
                        : 100,
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={data} columns={columns} pageSize={100} />
        </div>
    );
}
