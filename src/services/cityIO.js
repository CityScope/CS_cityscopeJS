import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getCityioData } from "../redux/reducer";
import settings from "../settings/settings.json";

class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldIdHash: null,
            finishedThisRequest: false,
            userEnteredCityioEndpoint: false
        };
        this.cityioURL = null;
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
            // not URL provided
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
        if (result.id !== this.state.oldIdHash) {
            // new data in table, get all modules
            // that are listed in settings
            settings.cityIO.cityIOmodules.forEach(module => {
                this.getCityIOmoduleData(module, this.cityioURL + "/" + module);
            });
            // move this hash to old one
            this.setState({
                oldIdHash: result.id
            });
        } else {
            // console.log("same hash");
            this.props.getCityioData(this.state.cityIOmodulesData);
        }
    };

    getCityIOmoduleData = (moduleName, URL) => {
        this.setState({ finishedThisRequest: false });
        axios
            .get(URL)
            .then(response => {
                this.setState(prevState => ({
                    cityIOmodulesData: {
                        ...prevState.cityIOmodulesData,
                        [moduleName]: response.data
                    }
                }));
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
            return null;
        }
    }
}

const mapDispatchToProprs = {
    getCityioData: getCityioData
};

export default connect(null, mapDispatchToProprs)(CityIO);
