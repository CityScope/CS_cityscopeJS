import { combineReducers } from "redux";
import cityIOdataSliceReducer from "./cityIOdataSlice";

export default combineReducers({
  cityIOdataStoreReducer: cityIOdataSliceReducer,
});
