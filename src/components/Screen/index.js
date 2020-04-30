import React from "react";
import { useSelector } from "react-redux";
import CityIO from "../../services/cityIO";
import MenuContainer from "../MenuContainer";
import BaseMapContainer from "../BaseMapContainer";
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
                    <BaseMapContainer />
                    <VisContainer />
                </>
            )}
            <LoadingSpinner />
        </>
    );
}

export default Screen;
