import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menuState",
  initialState: { menuState: {}, menuIsPopulated: false },
  reducers: {
    updateMenuState: (state, action) => {
      state.menuState = action.payload;
    },
    toggleMenuIsPopulated: (state, action) => {
      state.menuIsPopulated = action.payload;
    },
  },
});

export const { updateMenuState, toggleMenuIsPopulated } = menuSlice.actions;
export default menuSlice.reducer;
