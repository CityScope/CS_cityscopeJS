import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Radar from "./Radar";
import BarChart from "./BarChart/BarChart";
import AreaCalc from "./AreaCalc/AreaCalc";

function VisContainer(props) {
    const indicatorsData = props.cityIOdata;
    return (
        <>
            {indicatorsData && (
                <List>
                    <ListItem>
                        <AreaCalc cityioData={indicatorsData} />
                    </ListItem>
                    <ListItem>
                        <Radar cityioData={indicatorsData} />
                    </ListItem>
                    <ListItem>
                        {/* <BarChart
                            cityioData={indicatorsData}
                            drawerWidth={300}
                        /> */}
                    </ListItem>
                </List>
            )}
        </>
    );
}

export default VisContainer;
