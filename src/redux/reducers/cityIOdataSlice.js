import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataState",
  initialState: {},
  cityIOisDone: false,
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
    toggleCityIOisDone: (state, action) => {
      state.cityIOisDone = action.payload;
    },
  },
});

export const { updateCityIOdata, toggleCityIOisDone } = cityIOdataSlice.actions;
export default cityIOdataSlice.reducer;
