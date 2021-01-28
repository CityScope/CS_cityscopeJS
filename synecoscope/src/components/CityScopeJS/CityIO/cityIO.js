import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    getCityioData,
    setReadyState,
    setLoadingState,
    setScenarioNames,
    addLoadingModules,
    removeLoadingModules,
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
        const timer = setTimeout(update, settings.cityIO.interval);
        console.log("reading cityIO every" + settings.cityIO.interval + "ms");
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function update() {
        // recursively get hashes
        const newHashId = await getAPICall(cityioURL + "/meta/id");
        if (hashId !== newHashId) {
            setHashId(newHashId);
        }
        setTimeout(update, settings.cityIO.interval);
    }

    async function getModules() {
        const newHashes = await getAPICall(cityioURL + "/meta/hashes");
        const promises = [];
        const loadingModules = [];
        const pickedModules = settings.cityIO.cityIOmodules.map((x) => x.name);
        // for each of the modules in settings, add api call to promises
        pickedModules.forEach((module) => {
            if (hashes[module] !== newHashes[module]) {
                promises.push(getAPICall(cityioURL + "/" + module));
                loadingModules.push(module);
            } else {
                promises.push(null);
            }
        });
        dispatch(addLoadingModules(loadingModules));
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

        dispatch(removeLoadingModules(loadingModules));

        // send to cityio
        dispatch(getCityioData(modulesData));
        console.log("done updating from cityIO");

        // initializes rendering of Menu and Map containers
        dispatch(setReadyState(true));
        dispatch(setLoadingState(false));
    }

    useEffect(() => {
        //! only update if hashId changes
        if (!hashId) {
            return;
        }
        // reset the state of loading flag
        dispatch(setLoadingState(true));
        // set Scenario Names and Ids
        getScenarioIndices(tableName, (data) =>
            dispatch(setScenarioNames(data))
        );
        getModules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashId]);

    return null;
}
