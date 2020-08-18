import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    getCityioData,
    setReadyState,
    setLoadingState,
    setScenarioNames,
} from "../../../redux/actions";
import settings from "../../../settings/settings.json";
import { getScenarioIndices } from "./utils";

const getAPICall = async (URL) => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (err) {
        console.log(err);
    }
};

export default function CityIO(props) {
    const { tableName } = props;
    const [hashId, setHashId] = useState(null);
    const [hashes, setHashes] = useState({});
    const cityioURL = settings.cityIO.baseURL + tableName;
    const cityioData = useSelector((state) => state.CITYIO);

    const dispatch = useDispatch();

    /**
     * start fetching API hashes to check for new data
     */
    useEffect(() => {
        const timer = setTimeout(async function update() {
            const newHashId = await getAPICall(cityioURL + "/meta/id");
            if (hashId !== newHashId) {
                setHashId(newHashId);
            }
            // recursively call setTimeout when api call completes
            setTimeout(update, settings.cityIO.interval);
        }, settings.cityIO.interval);

        console.log(
            "starting cityIO GET interval every " +
                settings.cityIO.interval +
                "ms "
        );

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // only update if hashId changes
        if (!hashId) {
            return;
        }

        // reset the state of loading flag
        dispatch(setLoadingState(true));

        // set Scenario Names and Ids
        getScenarioIndices(tableName, (data) =>
            dispatch(setScenarioNames(data))
        );

        async function getModules() {
            const newHashes = await getAPICall(cityioURL + "/meta/hashes");

            const promises = [];
            const pickedModules = settings.cityIO.cityIOmodules;
            // for each of the modules in settings, add api call to promises
            pickedModules.forEach((module) => {
                if (hashes[module] !== newHashes[module]) {
                    promises.push(getAPICall(cityioURL + "/" + module));
                } else {
                    promises.push(null);
                }
            });
            const modules = await Promise.all(promises);
            setHashes(newHashes);

            // update cityio object with modules data
            const modulesData = pickedModules.reduce((obj, k, i) => {
                if (modules[i]) {
                    console.log(`updating ${k}`);
                    return { ...obj, [k]: modules[i] };
                } else {
                    return obj;
                }
            }, cityioData);
            modulesData.tableName = tableName;

            // send to cityio
            dispatch(getCityioData(modulesData));
            console.log("done updating from cityIO");

            // initializes rendering of Menu and Map containers
            dispatch(setReadyState(true));
            dispatch(setLoadingState(false));
        }
        getModules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashId]);

    return null;
}
