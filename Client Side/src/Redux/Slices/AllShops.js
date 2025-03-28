import { createSlice } from "@reduxjs/toolkit";

const shops = createSlice({
  name: "AllShops",
  initialState: [],
  reducers: {
    addShops: (state, action) => {
      state.push(action.payload);
    },
  },
});
export const addShop = shops.actions.addShops;
export default shops.reducer;
