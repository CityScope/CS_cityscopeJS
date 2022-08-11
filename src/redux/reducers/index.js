import { combineReducers } from "redux";
import cityIOdataSliceReducer from "./cityIOdataSlice";
import menuSliceReducer from "./menuSlice";
import editorMenuSliceReducer from "./editorMenuSlice";
import animationSliceReducer from "../../Components/_wip_animation/_animationSlice"; 

export default combineReducers({
  cityIOdataState: cityIOdataSliceReducer,
  menuState: menuSliceReducer,
  editorMenuState: editorMenuSliceReducer,
  animationState: animationSliceReducer,
});
