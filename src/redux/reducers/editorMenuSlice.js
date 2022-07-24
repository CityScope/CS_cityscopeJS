import { createSlice } from "@reduxjs/toolkit";
import { GridEditorSettings } from "../../settings/gridEditorSettings";

export const editorMenuSlice = createSlice({
  name: "menuState",
  initialState: {
    editorMapCenter: {
      latitude: GridEditorSettings.GEOGRID.properties.header.latitude,
      longitude: GridEditorSettings.GEOGRID.properties.header.longitude,
    },
    gridMaker: {},
    gridProps: {},
    typesEditorState: {},
  },
  reducers: {
    updateEditorMapCenter: (state, action) => {
      state.editorMapCenter = action.payload;
    },
    updateGridProps: (state, action) => {
      state.gridProps = action.payload;
    },
    updateGridMaker: (state, action) => {
      state.gridMaker = action.payload;
    },
    updateTypesEditorState: (state, action) => {
      state.typesEditorState = action.payload;
    },
  },
});

export const {
  updateEditorMapCenter,
  updateGridProps,
  updateGridMaker,
  updateTypesEditorState,
} = editorMenuSlice.actions;
export default editorMenuSlice.reducer;
