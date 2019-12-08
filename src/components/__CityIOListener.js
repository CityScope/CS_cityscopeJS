import React, { Component } from "react";

var tableName = window.location.search.substring(1);
var cityioHashURL = null;
var cityioURL = null;
if (tableName !== "") {
    cityioHashURL =
        "https://cityio.media.mit.edu/api/table/" +
        tableName.toString() +
        "/meta";
    cityioURL =
        "https://cityio.media.mit.edu/api/table/" +
        tableName.toString() +
        "/grid";
}
class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldHash: "nope hash",
            doneFetching: false,
            cityIOdata: null
        };
    }

    componentDidMount() {
        this.timer = setInterval(() => this.getCityioHash(cityioHashURL), 1000);
    }
    getCityioHash = URL => {
        this.setState({ doneFetching: false });
        fetch(URL)
            .then(response => response.json())
            .then(result => {
                this.handleCityIOHashes(result);
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, doneFetching: false });
            });
    };

    handleCityIOHashes = result => {
        if (result.hashes.grid !== this.state.oldHash) {
            this.setState({
                oldHash: result.hashes.grid
            });
            this.getCityio(cityioURL);
        } else {
            console.log("same hash");
        }
    };

    getCityio = URL => {
        this.setState({ doneFetching: false });
        fetch(URL)
            .then(response => response.json())
            .then(result => {
                this.setState({ cityIOdata: result, doneFetching: true });
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, doneFetching: false });
            });
    };

    render = () => <h1>cityio</h1>;
}

export default CityIO;
