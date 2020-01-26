import React, { Component } from "react";
import "./docs.css";
const ReactMarkdown = require("react-markdown");

const arch = require("./md/arch.md");

class Docs extends Component {
    state = { text: "Loading..." };

    componentDidMount() {
        fetch(arch)
            .then(response => response.text())
            .then(text => {
                this.setState({ text });
            });
    }

    render() {
        const { text } = this.state;

        return (
            <React.Fragment>
                <ReactMarkdown
                    source={text}
                    transformImageUri={input =>
                        /^https?:/.test(input) ? input : `../src/md/${input}`
                    }
                />
            </React.Fragment>
        );
    }
}

export default Docs;
