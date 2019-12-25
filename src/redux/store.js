import { createStore, combineReducers } from "redux";
import rootReducer from "./reducer";

const reducer = combineReducers(rootReducer);
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
