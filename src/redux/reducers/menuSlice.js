import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menuState",
  initialState: {
    editMenuState: {},
    typesMenuState: {},
    layersMenuState: {},
    viewSettingsMenuState: {},
  },
  reducers: {
    updateLayersMenuState: (state, action) => {
      state.layersMenuState = action.payload;
    },

    updateTypesMenuState: (state, action) => {
      state.typesMenuState = action.payload;
    },

    updateEditMenuState: (state, action) => {
      state.editMenuState = action.payload;
    },

    updateViewSettingsMenuState: (state, action) => {
      state.viewSettingsMenuState = action.payload;
    },
  },
});

export const {
  updateLayersMenuState,
  updateTypesMenuState,
  updateEditMenuState,
  updateViewSettingsMenuState,
} = menuSlice.actions;
export default menuSlice.reducer;
