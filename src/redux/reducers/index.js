import { combineReducers } from "redux";
import cityIOdataSliceReducer from "./cityIOdataSlice";
import menuSliceReducer from "./menuSlice";
import editorMenuSliceReducer from "./editorMenuSlice";

export default combineReducers({
  cityIOdataState: cityIOdataSliceReducer,
  menuState: menuSliceReducer,
  editorMenuState: editorMenuSliceReducer,
});
