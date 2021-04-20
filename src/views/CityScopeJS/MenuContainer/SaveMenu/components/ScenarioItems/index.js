import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setScenarioNames,
    setLoadingState,
} from "../../../../../../redux/actions";
import axios from "axios";
import settings from "../../../../../../settings/settings.json";
import { ListItem, Button, Typography, List } from "@material-ui/core";
import { _postMapEditsToCityIO } from "../../../../../../utils/utils";
import CancelIcon from "@material-ui/icons/Cancel";
import { getScenarioIndices } from "../../../../CityIO/utils";

function ScenarioItems(props) {
    const cityioData = useSelector((state) => state.CITYIO);
    const scenarioNames = useSelector((state) => state.SCENARIO_NAMES);
    const dispatch = useDispatch();

    const getScenario = (tableName, id) => {
        const getURL = `${settings.cityIO.baseURL}${tableName}/scenarios${id}/`;
        const options = {
            method: "get",
            url: getURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        axios(options)
            .then((res) => {
                const { GEOGRIDDATA } = res.data;
                _postMapEditsToCityIO(
                    GEOGRIDDATA,
                    cityioData.tableName,
                    "/GEOGRIDDATA"
                );
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    };

    const deleteScenario = (tableName, id) => {
        const getURL =
		`${settings.cityIO.baseURL}clear/${tableName}/scenarios${id}/`
        const options = {
            method: "get",
            url: getURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        axios(options)
            .then((res) => {
                getScenarioIndices(
                    cityioData.tableName,
                    (data) => dispatch(setScenarioNames(data)),
                    (state) => dispatch(setLoadingState(state))
                );
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    };

    const generateListItems = () =>
        scenarioNames.map((scenario) => (
            <ListItem key={scenario.id}>
                <Button
                    style={{ textTransform: "none" }}
                    onClick={() => {
                        dispatch(setLoadingState(true));
                        getScenario(cityioData.tableName, scenario.id);
                    }}
                >
                    <Typography variant="h6">{scenario.name}</Typography>
                </Button>
                <Button
                    onClick={() => {
                        dispatch(setLoadingState(true));
                        deleteScenario(cityioData.tableName, scenario.id);
                    }}
                >
                    <CancelIcon />
                </Button>
            </ListItem>
        ));

    return <List>{generateListItems()}</List>;
}

export default ScenarioItems;
