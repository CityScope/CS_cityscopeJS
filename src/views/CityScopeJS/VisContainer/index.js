import React from "react";
import { List, ListItem, Divider } from "@material-ui/core";
import Radar from "./Radar";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";

function VisContainer(props) {
    return (
        <>
            {props.cityIOdata && (
                <List>
                    <ListItem alignItems="center">
                        <AreaCalc cityioData={props.cityIOdata} />
                    </ListItem>

                    <Divider />

                    <ListItem>
                        <Radar cityioData={props.cityIOdata} />
                    </ListItem>

                    <Divider />

                    <ListItem>
                        <BarChart cityioData={props.cityIOdata} />
                    </ListItem>
                </List>
            )}
        </>
    );
}

export default VisContainer;
