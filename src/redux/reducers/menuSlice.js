import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menuState",
  initialState: { menu: null },
  reducers: {
    updateMenu: (state, action) => {
      state.menu = action.payload;
    },
  },
});

export const { updateMenu } = menuSlice.actions;
export default menuSlice.reducer;
