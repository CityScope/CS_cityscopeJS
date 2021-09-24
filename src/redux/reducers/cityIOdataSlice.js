import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataState",
  initialState: { cityIOdata: null },
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
  },
});

export const { updateCityIOdata } = cityIOdataSlice.actions;
export default cityIOdataSlice.reducer;
