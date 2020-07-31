import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setScenarioNames,
    setLoadingState,
} from "../../../../../../redux/actions";
import axios from "axios";
import settings from "../../../../../../settings/settings.json";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { _postMapEditsToCityIO } from "../../../../BaseMap/utils/BaseMapUtils";
import CancelIcon from "@material-ui/icons/Cancel";
import { getScenarioIndices } from "../../../../CityIO/utils";

function ScenarioItems(props) {
    const { toggleDrawer } = props;
    const cityioData = useSelector((state) => state.CITYIO);
    const scenarioNames = useSelector((state) => state.SCENARIO_NAMES);
    const dispatch = useDispatch();

    const getScenario = (tableName, id) => {
        const getURL = settings.cityIO.baseURL + tableName + "/scenarios" + id;
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
            settings.cityIO.baseURL + "clear/" + tableName + "/scenarios" + id;
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
                        toggleDrawer();
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

    return <div>{generateListItems()}</div>;
}

export default ScenarioItems;
