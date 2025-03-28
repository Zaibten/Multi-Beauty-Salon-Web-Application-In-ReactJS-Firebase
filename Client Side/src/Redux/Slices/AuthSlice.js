import { createSelector, createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "authState",
  initialState: [],
  reducers: {
    addState: (state, action) => {
      state.push(action.payload);
    },
    deleteState: (state, action) => {
      state.pop(action.payload);
    },
  },
});
export const getAuthSlice = createSelector(
  (state) => state.auth,
  (state) => state
);
export const addAuth = authSlice.actions;
export default authSlice.reducer;
