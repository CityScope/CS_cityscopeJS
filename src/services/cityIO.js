import React, { Component } from "react";
import Loader from "../components/Loader";
// import Menu from "../components/menu/menu";
// import Map from "../components/map/map";
// import Radar from "../components/vis/Radar/Radar";
import axios from "axios";

export default class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldHash: null,
            doneFetching: false,
            cityIOmodulesData: {
                header: null,
                interactive_grid_mapping: null,
                meta_grid: null,
                ABM: null,
                grid: null,
                access: null
            }
        };
        this.interval = 1000;
        this.tableName = window.location.search.substring(1);
        this.cityioURL = null;
        if (this.tableName !== "") {
            this.cityioURL =
                "https://cityio.media.mit.edu/api/table/" +
                this.tableName.toString();
        }
    }
    componentDidMount() {
        // inital call to cityIO
        this.getCityIOHash(this.cityioURL + "/meta");
        // start interval
        this.timer = setInterval(
            () => this.getCityIOHash(this.cityioURL + "/meta"),
            this.interval
        );
    }
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

    handleCityIOHashes = result => {
        if (result.hashes.grid !== this.state.oldHash) {
            // new data in table, get:
            Object.keys(this.state.cityIOmodulesData).forEach(module => {
                this.getCityIO(module, this.cityioURL + "/" + module);
            });
            // move this hash to old one
            this.setState({
                oldHash: result.hashes.grid
            });
        } else {
            console.log("...same hash at", this.cityioURL);
            this.setState({ doneFetching: true });
        }
    };

    getCityIO = (moduleName, URL) => {
        this.setState({ doneFetching: false });
        axios
            .get(URL)
            .then(response => {
                this.setState(prevState => ({
                    cityIOmodulesData: {
                        ...prevState.cityIOmodulesData,
                        [moduleName]: response.data
                    },
                    doneFetching: true
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

    _checkStillLoading = () => {
        // gor through each module to check it is not empty
        let bool = false;
        for (let module in this.state.cityIOmodulesData) {
            if (this.state.cityIOmodulesData[module] === null) {
                bool = true;
            }
        }
        return bool;
    };

    render() {
        // check if cityIO still gets modules data
        // don't init the map before so
        if (this._checkStillLoading()) {
            return <Loader loading={!this.state.doneFetching} />;
        } else {
            return (
                <div>
                    {/* <Map cityIOmodulesData={this.state.cityIOmodulesData} /> */}
                    <Loader loading={!this.state.doneFetching} />
                    {/* <Radar cityIOmodulesData={this.state.cityIOmodulesData} /> */}
                    {/* <Menu /> */}
                </div>
            );
        }
    }
}
