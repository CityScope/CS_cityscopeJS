import { createSlice } from "@reduxjs/toolkit";

export const editorMenuSlice = createSlice({
  name: "menuState",
  initialState: {
    editorMapCenter: {},
    gridProps: {},
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
  },
});

export const {
  updateEditorMapCenter,
  updateGridProps,
  updateGridMaker,
} = editorMenuSlice.actions;
export default editorMenuSlice.reducer;
