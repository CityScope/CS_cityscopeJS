import { createSlice } from "@reduxjs/toolkit";

export const editorMenuSlice = createSlice({
  name: "menuState",
  initialState: {
    editorMapCenter: {},
  },
  reducers: {
    updateEditorMapCenter: (state, action) => {
      state.editorMapCenter = action.payload;
    },
  },
});

export const { updateEditorMapCenter } = editorMenuSlice.actions;
export default editorMenuSlice.reducer;
