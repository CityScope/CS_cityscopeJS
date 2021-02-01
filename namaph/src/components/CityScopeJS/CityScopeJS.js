import React from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer/MenuContainer";
import MapContainer from "./BaseMap";
import VisContainer from "./VisContainer/VisContainer";
import LoadingSpinner from "./CityIO/LoadingSpinner";

export default function App(props) {
    // wait for 'ready' flag from cityIO when app is ready to start
    const ready = useSelector((state) => state.READY);
    // get the table name for cityIO comp
    const { tableName } = props;

    return (
        <>
            <CityIO tableName={tableName} />
            {/* if ready, render the app*/}
            {ready && (
                <>
                    <MenuContainer tableName={tableName} />
                    <MapContainer />
                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </>
    );
}
