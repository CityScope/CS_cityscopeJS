import React, { Component } from "react";
import "./fallback.css";

class Fallback extends Component {
    render() {
        return (
            <div className="background">
                <div className="info shadow">
                    <h1>CityScopeJS</h1>
                    CityScopeJS is a unified front-end for the{" "}
                    <a href="https://cityscope.media.mit.edu/">
                        MIT CityScope
                    </a>{" "}
                    project, an{" "}
                    <a href="https://github.com/CityScope/CS_cityscopeJS">
                        open-source
                    </a>{" "}
                    urban modeling and simulation platform. Start by adding
                    CityScope table name to the URL{" "}
                    <small>
                        [for example{" "}
                        <a href="https://cityscope.media.mit.edu/CS_cityscopeJS/?grasbrook">
                            CityScopeJS Grasbrook
                        </a>
                        ]
                    </small>{" "}
                    or click <a href="https://cityio.media.mit.edu"> here</a>{" "}
                    for a list of active CityScope tables. <br />
                    <br />
                </div>
            </div>
        );
    }
}

export default Fallback;
