import axios from "axios";
import settings from "../../../settings/settings.json";

export const getScenarioIndices = (
    tableName,
    setScenarioNames,
    setLoadingState
) => {
    var url = settings.cityIO.baseURL + tableName + "/meta/hashes";
    axios
        .get(url)
        .then((res) => {
            const metaDataKeys = Object.keys(res.data);
            const scenarioIndices = metaDataKeys
                .filter((str) => str.includes("scenarios"))
                .map((str) => parseInt(str.replace("scenarios", "")));
            const promises = [];
            for (const id of scenarioIndices) {
                promises.push(getScenarioName(tableName, id));
            }
            Promise.all(promises)
                .then((res) => {
                    setScenarioNames(
                        res.map((r) => ({
                            name: r.data.name,
                            id: r.data.id,
                        }))
                    );
                    setLoadingState && setLoadingState(false);
                })
                .catch((err) =>
                    console.log("error getting scenario names", err)
                );
        })
        .catch((err) => {
            console.log("Error getting scenarios", err);
        });
};

export const getScenarioName = (tableName, id) => {
    const url =
        settings.cityIO.baseURL + tableName + "/scenarios" + id + "/info";
    return axios.get(url);
};
