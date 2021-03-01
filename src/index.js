import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import App from "./App";
import Provider from "./redux/Provider";
import store from "./redux/store";

// ! basename={process.env.PUBLIC_URL}

ReactDOM.render(
    <Provider store={store}>
        {/* https://github.com/facebook/create-react-app/issues/1765 */}
        <HashRouter basename={process.env.PUBLIC_URL}>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById("root")
);
