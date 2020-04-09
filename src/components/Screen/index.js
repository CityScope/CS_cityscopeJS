import React from "react";
import { useSelector } from "react-redux";
import CityIO from "../../services/cityIO";
import MenuContainer from "../MenuContainer";
import MapContainer from "../baseMap/baseMapContainer";
import VisContainer from "../vis/visContainer";
import LoadingSpinner from "../LoadingSpinner";

function Screen(props) {
    const ready = useSelector(state => state.READY);
    const { tableName } = props;

    return (
        <>
            <CityIO tableName={tableName} />
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
