import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
const store = configureStore({
  reducer: rootReducer,
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <>
      <Provider store={store}>
        <App />
      </Provider>
    </>
  </StrictMode>
);
