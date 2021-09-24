import { createSlice } from "@reduxjs/toolkit";

export const cityIOdataSlice = createSlice({
  name: "cityIOdataStoreReducer",
  initialState: { cityIOdata: {} },
  reducers: {
    updateCityIOdata: (state, action) => {
      state.cityIOdata = action.payload;
    },
  },
});

export const { updateCityIOdata } = cityIOdataSlice.actions;
console.log(updateCityIOdata);
export default cityIOdataSlice.reducer;
