import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataState",
  initialState: {},
  cityIOisDone: false,
  cityIOtableName: "",
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
    toggleCityIOisDone: (state, action) => {
      state.cityIOisDone = action.payload;
    },
    updateCityIOtableName: (state, action) => {
      state.cityIOtableName = action.payload;
    },
  },
});

export const {
  updateCityIOdata,
  toggleCityIOisDone,
  updateCityIOtableName,
} = cityIOdataSlice.actions;
export default cityIOdataSlice.reducer;
