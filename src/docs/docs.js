import React, { Component } from "react";
import "./docs.css";
import axios from "axios";
const ReactMarkdown = require("react-markdown");

class Docs extends Component {
    state = { text: "loading..." };

    componentDidMount() {
        const doc =
            "https://raw.githubusercontent.com/CityScope/CS_cityscopeJS/master/src/docs/md/" +
            this.props.doc +
            ".md";

        axios
            .get(doc, {
                mode: "no-cors"
            })
            .then(response => {
                this.setState({ text: response.data });
            });
    }

    render() {
        return (
            <div className="docs">
                <ReactMarkdown source={this.state.text} />
            </div>
        );
    }
}

export default Docs;
