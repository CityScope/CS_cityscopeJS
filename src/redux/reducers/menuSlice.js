import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menuState",
  initialState: {
    menuState: {},
    menuIsPopulated: false,
    editMenuState: {},
    typesMenuState: {},
    layersMenuState: {},
    viewSettingsMenuState: {},
  },
  reducers: {
    updateMenuState: (state, action) => {
      state.menuState = action.payload;
    },

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

    toggleMenuIsPopulated: (state, action) => {
      state.menuIsPopulated = action.payload;
    },
  },
});

export const {
  updateMenuState,
  updateLayersMenuState,
  updateTypesMenuState,
  toggleMenuIsPopulated,
  updateEditMenuState,
  updateViewSettingsMenuState,
} = menuSlice.actions;
export default menuSlice.reducer;
