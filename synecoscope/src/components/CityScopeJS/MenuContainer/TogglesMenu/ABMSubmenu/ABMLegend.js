import React from "react";
import { DiscreteColorLegend } from "react-vis";
import Typography from "@material-ui/core/Typography";

// ! https://github.com/uber/react-vis/blob/premodern/showcase/legends/searchable-discrete-color.js

export default function ABMLegend(props) {
    const tripsAttr = props.trips.tripsData;
    const modes = tripsAttr.mode;
    const profiles = tripsAttr.profile;

    const prepareLegendData = (string) => {
        let data = string === "mode" ? modes : profiles;

        let legendData = [];
        for (const key in data) {
            legendData.push({ title: data[key].name, color: data[key].color });
        }
        return legendData;
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {props.tripTypeValue === "mode" ? "Mode Choise" : "Profiles "}
            </Typography>
            <DiscreteColorLegend
                height={300}
                width={150}
                items={prepareLegendData(props.tripTypeValue)}
            />
        </>
    );
}
