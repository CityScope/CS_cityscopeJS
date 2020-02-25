import React from "react";
import Provider from "../Provider";
import configureStore from "../redux/store";

const store = configureStore();

export const WithProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);
