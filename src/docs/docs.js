import React, { Component } from "react";
import settings from "../settings/settings.json";

import "./docs.css";
import axios from "axios";
const ReactMarkdown = require("react-markdown");

const docsURL = settings.docsURL;

class Docs extends Component {
    state = { text: "loading..." };

    componentDidMount() {
        const doc = docsURL + this.props.doc + ".md";
        // get the doc
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
                <ReactMarkdown
                    source={this.state.text}
                    transformImageUri={uri =>
                        uri.startsWith("http")
                            ? uri
                            : `${settings.docsURL}${uri}`
                    }
                />
            </div>
        );
    }
}

export default Docs;
