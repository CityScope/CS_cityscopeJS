import { Component } from "react";

class CityIO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            cityioURL:
                "https://cityio.media.mit.edu/api/table/" +
                this.props.tableName +
                "/" +
                this.props.module
        };
    }

    componentDidMount() {
        fetch(this.state.cityioURL)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({ data: result });
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state });
            });
    }

    render() {
        return this.state.data;
    }
}

export default CityIO;
