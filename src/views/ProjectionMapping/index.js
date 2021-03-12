import React from "react";
import { useSelector } from "react-redux";
import CityIO from "./CityIO";
import Keystone from "./Keystone";

export default function CityScopeJS() {
    // wait for 'ready' flag from cityIO when app is ready to start
    const isReady = useSelector((state) => state.READY);

    return (
        <>
            <CityIO tableName={"corktown"} />
            {isReady && <Keystone />}
        </>
    );
}
