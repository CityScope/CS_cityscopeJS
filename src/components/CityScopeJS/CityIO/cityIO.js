import { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
    getCityioData,
    setReadyState,
    setLoadingState,
    setScenarioNames,
} from "../../../redux/actions";
import settings from "../../../settings/settings.json";
import { getScenarioIndices } from "./utils";

class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldHashs: {},
            cityIOmodulesData: {},
        };
        this.cityioURL = null;
    }

    /**
     * start fetching API hashes to check for new data
     */
    componentDidMount() {
        this._isMounted = true;
        this.handleURL();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleURL = () => {
        this.cityioURL = settings.cityIO.baseURL + this.props.tableName;

        // get the hashes first
        this.getCityIOHash(this.cityioURL + "/meta");
        // and every interval
        this.timer = setInterval(() => {
            if (this._isMounted) {
                this.getCityIOHash(this.cityioURL + "/meta");
            }
        }, settings.cityIO.interval);
        console.log(
            "starting cityIO GET interval every " +
                settings.cityIO.interval +
                "ms "
        );
    };

    /**
     * returns only the hasees from API
     */
    getCityIOHash = (URL) => {
        axios
            .get(URL)
            .then((response) => {
                this.handleCityIOHashes(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    /**
     * check for updated hashes.
     * if new hashes exist,
     * fetch !! WHOLE API (for now)
     */
    handleCityIOHashes = (result) => {
        // if master hash ID has changed (cityIO table state)
        if (result.id !== this.state.oldHashs.id) {
            // reset the cityIOmodulesStatus
            this.setState({ cityIOmodulesStatus: {} });

            // reset the state of this flag
            this.props.setLoadingState(true);

            // get scenario indices
            getScenarioIndices(
                this.props.tableName,
                this.props.setScenarioNames
            );

            // new data in table, get all modules
            // that are listed in settings
            settings.cityIO.cityIOmodules.forEach((module) => {
                // only update modules that have new data
                if (result.hashes[module] !== this.state.oldHashs[module]) {
                    // set this module as not ready
                    this.setNestedState("cityIOmodulesStatus", module, false);
                    // get the module data from cityIO
                    this.getCityIOmoduleData(
                        module,
                        this.cityioURL + "/" + module
                    );
                    // update this new module hash in state
                    this.setNestedState(
                        "oldHashs",
                        module,
                        result.hashes[module]
                    );
                } else {
                    // update module name with ok
                    this.setNestedState("cityIOmodulesStatus", module, true);
                }
            });
            this.checkDoneCityIO();
            // finally, put to state the hashes master id
            this.setNestedState("oldHashs", "id", result.id);
        }
    };

    /**
     *
     * Helper function to set nested state
     */

    setNestedState = (parent, child, data) => {
        var holder = { ...this.state[parent] };
        holder[child] = data;
        this.setState({ [parent]: holder });
    };

    /**
     * get each module data
     */
    getCityIOmoduleData = (moduleName, URL) => {
        axios
            .get(URL)
            .then((response) => {
                // put response to state obj
                this.setNestedState(
                    "cityIOmodulesData",
                    moduleName,
                    response.data
                );
                console.log("...updating module:", moduleName);
                this.setNestedState("cityIOmodulesStatus", moduleName, true);
                this.checkDoneCityIO();
            })

            .catch((error) => {
                if (error.response) {
                    console.log(
                        "error.response:",
                        "\n",
                        error.response.data,
                        "\n",
                        error.response.status,
                        "\n",
                        error.response.headers
                    );
                } else if (error.request) {
                    console.log("error.request:", error.request);
                } else {
                    console.log("misc error:", error.message);
                }
                console.log("request config:", error.config);
            });
    };

    checkDoneCityIO = () => {
        // check if all modules are done
        for (const status in this.state.cityIOmodulesStatus) {
            if (this.state.cityIOmodulesStatus[status] !== true) {
                // we still need to update some module, stop
                return;
            }
        }
        //  if so, share the data with the app
        const data = this.state.cityIOmodulesData;
        data.tableName = this.props.tableName;
        // finally, send data to redux
        this.props.getCityioData(data);
        console.log("done updating from cityIO");

        // initializes rendering of Menu and Map containers
        this.props.setReadyState(true);
        this.props.setLoadingState(false);
    };

    render() {
        return null;
    }
}

const mapDispatchToProps = {
    getCityioData: getCityioData,
    setReadyState: setReadyState,
    setLoadingState: setLoadingState,
    setScenarioNames: setScenarioNames,
};

export default connect(null, mapDispatchToProps)(CityIO);
