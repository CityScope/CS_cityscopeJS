import { useEffect, useState } from "react";
import { cityIOSettings, generalSettings } from "../../settings/settings";
import {
  updateCityIOdata,
  toggleCityIOisDone,
} from "../../redux/reducers/cityIOdataSlice";
import { useSelector, useDispatch } from "react-redux";
import { getAPICall } from "../../utils/utils";
import LoadingProgressBar from "../LoadingProgressBar";

const removeElement = (array, elem) => {
  var index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
};

const CityIO = (props) => {
  const verbose = true; // set to true to see console logs
  const waitTimeMS = 5000;
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const cityscopeProjectURL = generalSettings.csjsURL;
  const { tableName } = props;
  const [mainHash, setMainHash] = useState(null);
  const [hashes, setHashes] = useState({});
  const [listLoadingModules, setListLoadingModules] = useState([]);
  const cityioURL = `${cityIOSettings.cityIO.baseURL}table/${tableName}/`;

  // test if cityIO is up and this table exists
  useEffect(() => {
    const testCityIO = async () => {
      let test = await getAPICall(cityioURL + "meta/");
      if (test) {
        // start fetching API hashes to check for new data
        getCityIOmetaHash();
        verbose &&
          console.log(
            "%c cityIO is up, reading cityIO every " +
              cityIOSettings.cityIO.interval +
              "ms",
            "color: red"
          );
      } else {
        setListLoadingModules([
          `cityIO might be down, please check { ${tableName} } is correct. Returning to cityScopeJS at ${cityscopeProjectURL} in ${
            waitTimeMS / 1000
          } seconds`,
        ]);

        new Promise((resolve) => {
          setTimeout(() => {
            window.location.assign(cityscopeProjectURL);
          }, waitTimeMS);
          resolve();
        });
      }
    };
    testCityIO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityioURL]);

  /**
   * gets the main hash of this cityIO table
   * on a constant loop to check for updates
   */
  async function getCityIOmetaHash() {
    // recursively get hashes
    await getAPICall(cityioURL + "meta/id/").then((res) => {
      if (mainHash !== res) {
        setMainHash(res);
      }
    });
    // is it a new hash?

    // do it forever
    setTimeout(getCityIOmetaHash, cityIOSettings.cityIO.interval);
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
    // wait to get all of this table's hashes
    const newHashes = await getAPICall(cityioURL + "meta/hashes/");
    // init array of GET promises
    const promises = [];
    // init array of modules names
    const loadingModules = [];
    // get an array of modules to update
    const modulesToUpdate = cityIOSettings.cityIO.cityIOmodules.map(
      (x) => x.name
    );
    // for each of the modules in settings, add api call to promises
    modulesToUpdate.forEach((module) => {
      verbose &&
        console.log(
          "%c checking {" + module + "} for updates...",
          "color:rgb(200, 200, 0)"
        );
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
        verbose &&
          console.log(
            "%c {" +
              moduleName +
              "} state has changed on cityIO. Getting new data...",
            "color:  rgb(0, 200, 255)"
          );
        setListLoadingModules(removeElement(listLoadingModules, moduleName));

        return { ...obj, [moduleName]: modulesFromCityIO[index] };
      } else {
        return obj;
      }
    }, cityIOdata);
    let m = { ...modulesData, tableName: tableName };
    dispatch(updateCityIOdata(m));
    verbose &&
      console.log(
        "%c --- done updating from cityIO ---",
        "color: rgb(0, 255, 0)"
      );
    dispatch(toggleCityIOisDone(true));
  }

  return <LoadingProgressBar loadingModules={listLoadingModules} />;
};

export default CityIO;
