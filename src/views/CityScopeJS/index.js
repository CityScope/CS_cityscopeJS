import React, { useState , useEffect} from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import MenuContainer from "./MenuContainer/MenuContainer";
import MapContainer from "./BaseMap";
import VisContainer from "./VisContainer/VisContainer";
import LoadingSpinner from "./CityIO/LoadingSpinner";

export default function CityScopeJS() {
    // get the table name for cityIO comp
    const [tableName, setTableName] = useState(null);
    useEffect(() => {
        let url = window.location.toString();
        let pre = "cityscope=";
        let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);
        // check URL for proper CS project link
        if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
            setTableName(cityscopePrjName);
        }
    }, []);

    // wait for 'ready' flag from cityIO when app is ready to start
    const ready = useSelector((state) => state.READY);

    return (
        <>
           {tableName && <CityIO tableName={tableName} />}
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
