import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataStoreReducer",
  initialState: {},
  reducers: {
    updateCityIOdata: {
      reducer(state, action) {
        const { cityioData } = action.payload;
        state.cityioData = cityioData;
      },
    },
  },
});

export const { updateCityIOdata } = cityIOdataSlice.actions;
export default cityIOdataSlice.reducers;
