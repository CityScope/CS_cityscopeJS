import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import settings from "../../../../../settings/settings.json";
import { setScenario, getCityioData } from "../../../../../redux/actions";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

function ScenarioItems() {
    const [scenarioNames, setScenarioNames] = useState([]);

    const cityioData = useSelector(state => state.CITYIO);

    useEffect(() => {
        getScenarioNames(cityioData.tableName);
    }, [cityioData.tableName]);

    const getScenarioNames = tableName => {
        return axios
            .get(settings.cityIO.mockURL + "/scenarios/?tableName=" + tableName)
            .then(res => {
                console.log("url", tableName);
                console.log("data", res);
                setScenarioNames(
                    res.data.map(x => {
                        return [x.id, x.name];
                    })
                );
            })
            .catch(error => {
                console.log("ERROR:", error);
            });
    };

    const dispatch = useDispatch();

    const dispatchSetScenario = val => dispatch(setScenario(val));
    const openScenario = val => dispatch(getCityioData(val));

    const getScenario = id => {
        return axios
            .get(settings.cityIO.mockURL + "/scenarios/" + id)
            .then(res => {
                dispatchSetScenario(res.data.id);
                console.log(res.data);
                openScenario(res.data);
            })
            .catch(error => {
                console.log("ERROR:", error);
            });
    };

    const generateListItems = () => {
        const listItems = [];

        for (let scenario of scenarioNames) {
            listItems.push(
                <ListItem
                    button
                    key={scenario[0]}
                    onClick={() => {
                        getScenario(scenario[0]);
                        console.log(scenario[0]);
                    }}
                >
                    <Typography variant="h6">{scenario[1]}</Typography>
                </ListItem>
            );
        }
        return listItems;
    };

    return <div>{generateListItems()}</div>;
}

export default ScenarioItems;
