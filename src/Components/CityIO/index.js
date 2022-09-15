import { useEffect, useState } from "react";
import { cityIOSettings } from "../../settings/settings";
import {
  updateCityIOdata,
  toggleCityIOisDone,
} from "../../redux/reducers/cityIOdataSlice";
import { useSelector, useDispatch } from "react-redux";
import { getAPICall } from "../../utils/utils";
import LoadingModules from "../../Components/LoadingModules";

const removeElement = (array, elem) => {
  var index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

const CityIO = (props) => {
  const settings = cityIOSettings;
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const { tableName } = props;

  const [mainHash, setMainHash] = useState(null);
  const [hashes, setHashes] = useState({});
  const [listLoadingModules, setListLoadingModules] = useState([]);
  const cityioURL = `${settings.cityIO.baseURL}table/${tableName}/`;

  /**
   * start fetching API hashes to check for new data
   */
  useEffect(() => {
    const timer = setTimeout(getCityIOmetaHash, settings.cityIO.interval);
    console.log("reading cityIO every " + settings.cityIO.interval + "ms");
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * gets the main hash of this cityIO table
   * on a constant loop to check for updates
   */
  async function getCityIOmetaHash() {
    // recursively get hashes
    const newMainHash = await getAPICall(cityioURL + "meta/id/");
    // is it a new hash?
    if (mainHash !== newMainHash) {
      setMainHash(newMainHash);
    }
    // do it forever
    setTimeout(getCityIOmetaHash, settings.cityIO.interval);
  }

  useEffect(() => {
    //! only update if hashId changes
    if (!mainHash) {
      return;
    }
    // if we have a new hash, start getting submodules
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainHash]);

  async function getModules() {
    console.log("--- starting update ---");
    // wait to get all of this table's hashes
    const newHashes = await getAPICall(cityioURL + "meta/hashes/");
    // init array of GET promises
    const promises = [];
    // init array of modules names
    const loadingModules = [];
    // get an array of modules to update
    const modulesToUpdate = settings.cityIO.cityIOmodules.map((x) => x.name);
    // for each of the modules in settings, add api call to promises
    modulesToUpdate.forEach((module) => {
      // if this module has an old hash
      // we assume it is about to be updated
      if (hashes[module] !== newHashes[module]) {
        // add this module URL to an array of GET requests
        promises.push(getAPICall(`${cityioURL}${module}/`));
        // and also add this module name to array
        // of modules that we await for
        loadingModules.push(module);
      } else {
        promises.push(null);
      }
      setListLoadingModules(loadingModules);
    });

    // GET all modules data
    const modulesFromCityIO = await Promise.all(promises);
    setHashes(newHashes);

    // update cityio object with modules data
    let modulesData = modulesToUpdate.reduce((obj, moduleName, index) => {
      // if this module has data
      if (modulesFromCityIO[index]) {
        setListLoadingModules(removeElement(listLoadingModules, moduleName));

        return { ...obj, [moduleName]: modulesFromCityIO[index] };
      } else {
        return obj;
      }
    }, cityIOdata);
    let m = { ...modulesData, tableName: tableName };
    dispatch(updateCityIOdata(m));
    console.log("--- done updating from cityIO ---");
    dispatch(toggleCityIOisDone(true));
  }

  return <LoadingModules loadingModules={listLoadingModules} />;
};

export default CityIO;