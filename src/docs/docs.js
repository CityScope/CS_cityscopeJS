import React, { Component } from "react";
import "./docs.css";
const ReactMarkdown = require("react-markdown");

// const arch = require("./md/arch.md");
// const home = require("./md/home.md");
// const schema = require("./md/schema.md");

class Docs extends Component {
    state = { text: "loading..." };

    componentDidMount() {
        const doc = require("./md/" + this.props.doc + ".md");
        fetch(doc)
            .then(response => response.text())
            .then(text => this.setState({ text: text }));
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
