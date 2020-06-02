import React from "react";
import { useSelector } from "react-redux";
import CityIO from "../../services/cityIO";
import MenuContainer from "../MenuContainer/MenuContainer";
import MapContainer from "../baseMap/baseMapContainer";
import VisContainer from "../vis/visContainer";
import LoadingSpinner from "../LoadingSpinner";

function Screen(props) {
    // wait for 'ready' flag when app is ready to start
    const ready = useSelector((state) => state.READY);
    // get the table name for cityIO comp
    const { tableName } = props;

    return (
        <>
            <CityIO tableName={tableName} />
            {/* if ready, render the app*/}
            {ready && (
                <>
                    <MenuContainer />
                    <MapContainer />
                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </>
    );
}

export default Screen;
