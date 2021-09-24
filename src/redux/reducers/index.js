import { combineReducers } from "redux";
import cityIOdataSliceReducer from "./cityIOdataSlice";
import menuSliceReducer from "./menuSlice";

export default combineReducers({
  cityIOdataState: cityIOdataSliceReducer,
  menuState: menuSliceReducer,
});
