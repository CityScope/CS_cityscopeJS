import { createStore } from "redux";
import reducer from "./reducer";

// combineReducers
// const reducer = combineReducers(reducer);
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
