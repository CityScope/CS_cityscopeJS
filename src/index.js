import ReactDOM from "react-dom";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducers";

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,

  document.getElementById("root")
);
