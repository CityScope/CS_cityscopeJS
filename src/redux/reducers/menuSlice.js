import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menuState",
  initialState: {
    menuState: {},
    menuIsPopulated: false,
    editMenuState: {},
    typesMenuState: {"none":"selected"},
  },
  reducers: {
    updateMenuState: (state, action) => {
      state.menuState = action.payload;
    },

    updateTypesMenuState: (state, action) => {
      state.typesMenuState = action.payload;
    },

    updateEditMenuState: (state, action) => {
      state.editMenuState = action.payload;
    },
    toggleMenuIsPopulated: (state, action) => {
      state.menuIsPopulated = action.payload;
    },
  },
});

export const {
  updateMenuState,
  updateTypesMenuState,
  toggleMenuIsPopulated,
  updateEditMenuState,
} = menuSlice.actions;
export default menuSlice.reducer;
