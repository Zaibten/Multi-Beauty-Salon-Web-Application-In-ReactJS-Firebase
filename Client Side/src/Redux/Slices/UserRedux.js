const { createSlice } = require("@reduxjs/toolkit");

const authUser = createSlice({
  name: "userAccount",
  initialState: {
    isUser: false,
  },
  reducers: {
    userLogIn: (state) => {
      state.isUser = true;
    },
    userLogout: (state) => {
      state.isUser = false;
    },
  },
});
export const { userLogIn, userLogout } = authUser.actions;
export default authUser.reducer;
