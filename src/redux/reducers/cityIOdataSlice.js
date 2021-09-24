import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataStore",
  initialState: { cityIOdata: null },
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
  },
});

export const { updateCityIOdata } = cityIOdataSlice.actions;
export default cityIOdataSlice.reducer;
