import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataStore",
  initialState: { cityIOdata: {} },
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
  },
});

export const { updateCityIOdata } = cityIOdataSlice.actions;
export default cityIOdataSlice.reducer;
