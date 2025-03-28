import { createSlice } from "@reduxjs/toolkit";

const saveShopdetail = createSlice({
  name: "saveDetailForBook",
  initialState: null,
  reducers: {
    addDetailForBook: (state, action) => {
      state.push(action.payload);
    },
    deleteDetailForBook: (state, action) => {
      state.pop(action.payload);
    },
  },
});
export const addBookDetail = saveShopdetail.actions;
export default saveShopdetail.reducer;
