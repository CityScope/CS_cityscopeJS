import { createSlice } from "@reduxjs/toolkit";

export const animationSlice = createSlice({
  name: "menuState",
  initialState: {
    animationTime: 0,
  },
  reducers: {
    updateAnimationTimeState: (state, action) => {
      state.animationTime = action.payload;
    },
  },
});

export const { updateAnimationTimeState } = animationSlice.actions;
export default animationSlice.reducer;
