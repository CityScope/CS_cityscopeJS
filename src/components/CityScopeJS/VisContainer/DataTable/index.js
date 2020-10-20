import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";

export default function DataTable() {
    const [cityioData] = useSelector((state) => [state.CITYIO]);

    const data = useMemo(
        () => cityioData.indicators.map((d, i) => ({ id: i + 1, ...d })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

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

    console.log(data);

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={data} columns={columns} pageSize={100} />
        </div>
    );
}
