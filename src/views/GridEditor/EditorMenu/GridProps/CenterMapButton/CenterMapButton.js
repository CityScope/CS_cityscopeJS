import React from "react";
import Button from "@material-ui/core/Button";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import { useDispatch } from "react-redux";

import { listenToBaseMapCenter } from "../../../../../redux/actions";

export default function CenterMapButton(props) {
    const dispatch = useDispatch();

    return (
        <Button
            onClick={() => {
                dispatch(
                    listenToBaseMapCenter({
                        latCenter: parseFloat(props.mapCenter[0]),
                        lonCenter: parseFloat(props.mapCenter[1]),
                    })
                );
            }}
            variant="outlined"
            color="default"
            startIcon={<CenterFocusStrongIcon />}
            style={{ fontSize: "12px" }}
        >
            Center Map
        </Button>
    );
}
