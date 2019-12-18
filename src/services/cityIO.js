import React, { Component } from "react";
import Loader from "../components/Loader";
import axios from "axios";

export default class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldHash: "nope hash",
            doneFetching: false,

            cityIOmodulesData: {
                ABM: null,
                grid: null,
                access: null
            }
        };

        this.tableName = window.location.search.substring(1);
        this.cityioURL = null;
        if (this.tableName !== "") {
            this.cityioURL =
                "https://cityio.media.mit.edu/api/table/" +
                this.tableName.toString();
        }
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.getCityIOHash(this.cityioURL + "/meta"),
            1000
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
            console.log(this.state.cityIOmodulesData);

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

    render = () => (
        <div>
            <Loader loading={!this.state.doneFetching} />
        </div>
    );
}
