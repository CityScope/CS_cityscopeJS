import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducers";

const store = configureStore({
  reducer: rootReducer,
});

// ! basename={process.env.PUBLIC_URL}

ReactDOM.render(
  <>
    {/* https://github.com/facebook/create-react-app/issues/1765 */}
    <Provider store={store}>
      <HashRouter basename={process.env.PUBLIC_URL}>
        <App />
      </HashRouter>
    </Provider>
    ,
  </>,

  document.getElementById("root")
);
