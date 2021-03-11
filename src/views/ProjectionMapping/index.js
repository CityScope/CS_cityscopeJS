import React from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO/cityIO";
import LoadingSpinner from "./CityIO/LoadingSpinner";
import MissingTableInfo from "../Errors/MissingTableInfo";
import ProjectionMapping from "./Keystone";

export default function CityScopeJS() {
    // wait for 'ready' flag from cityIO when app is ready to start
    const isReady = useSelector((state) => state.READY);

    return (
        <>
            {!isReady && <MissingTableInfo />}
            <CityIO tableName={"cityscopejs"} />
            {isReady && <ProjectionMapping />}
            <LoadingSpinner />
        </>
    );
}
