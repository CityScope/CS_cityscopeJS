import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getCityioData } from "../redux/reducer";
import settings from "../settings/settings.json";

class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldHashs: {},
            userEnteredCityioEndpoint: false,
            cityIOmodulesData: {}
        };
        this.cityioURL = null;
        // number of modules to load
        this.counter = settings.cityIO.cityIOmodules.length;
    }

    /**
     * start fetching API hashes to check for new data
     */
    componentDidMount() {
        this.handleURL();
    }

    handleURL = () => {
        this.tableName = window.location.search.substring(1);

        if (this.tableName !== "") {
            this.setState({ userEnteredCityioEndpoint: true });
            this.cityioURL =
                settings.cityIO.baseURL + this.tableName.toString();
            // get the hashes first
            this.getCityIOHash(this.cityioURL + "/meta");
            // and every interval
            this.timer = setInterval(
                () => this.getCityIOHash(this.cityioURL + "/meta"),
                settings.cityIO.interval
            );
        } else {
            // no URL provided
            this.setState({ userEnteredCityioEndpoint: false });
        }
    };

    /**
     * returns only the hasees from API
     */
    getCityIOHash = URL => {
        fetch(URL)
            .then(response => response.json())
            .then(result => {
                this.handleCityIOHashes(result);
            })
            .catch(e => {
                console.log(e);
            });
    };

    /**
     * check for updated hashes.
     * if new hashes exist,
     * fetch !! WHOLE API (for now)
     */
    handleCityIOHashes = result => {
        // if master hash ID has changed (cityIO table state)
        if (result.id !== this.state.oldHashs.id) {
            // new data in table, get all modules
            // that are listed in settings
            settings.cityIO.cityIOmodules.forEach(module => {
                if (result.hashes[module] !== this.state.oldHashs[module]) {
                    this.getCityIOmoduleData(
                        module,
                        this.cityioURL + "/" + module
                    );

                    this.setNestedState(
                        "oldHashs",
                        module,
                        result.hashes[module]
                    );
                }
            });
            // finally, put to state the hashes master id
            this.setNestedState("oldHashs", "id", result.id);
        }
    };

    checkDoneCityIO = () => {
        this.counter = this.counter - 1;
        // count if we've updated all modules already
        if (this.counter === 0) {
            console.log("done updating from cityIO..");
            this.setState({ readyForRedux: true });
        }
    };

    sharePropsWithRedux = data => {
        if (this.state.readyForRedux === true) {
            this.props.getCityioData(data);
            this.setState({ readyForRedux: false });
        }
    };

    setNestedState = (parent, child, data) => {
        var holder = { ...this.state[parent] };
        holder[child] = data;
        this.setState({ [parent]: holder });
    };

    getCityIOmoduleData = (moduleName, URL) => {
        axios
            .get(URL)
            .then(response => {
                // put response to state obj
                this.setNestedState(
                    "cityIOmodulesData",
                    moduleName,
                    response.data
                );
                console.log("...updating module:", moduleName);
                this.checkDoneCityIO();
            })

            .catch(error => {
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

    render() {
        if (this.state.userEnteredCityioEndpoint === false) {
            return (
                <div>
                    <h1
                        style={{
                            fontSize: 100,
                            color: "white",
                            position: "fixed",
                            zIndex: 1000
                        }}
                    >
                        No CityIO endpoint was provided..
                    </h1>
                </div>
            );
        } else {
            this.sharePropsWithRedux(this.state.cityIOmodulesData);
            return null;
        }
    }
}

const mapDispatchToProps = {
    getCityioData: getCityioData
};

export default connect(null, mapDispatchToProps)(CityIO);
