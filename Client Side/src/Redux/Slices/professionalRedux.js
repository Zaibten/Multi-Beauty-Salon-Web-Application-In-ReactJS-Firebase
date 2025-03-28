const { createSlice } = require("@reduxjs/toolkit");

const authProfessional = createSlice({
  name: "professionalAccount",
  initialState: {
    isProfessional: false,
  },
  reducers: {
    professionalLogIn: (state) => {
      state.isProfessional = true;
    },
    professionalLogOut: (state) => {
      state.isProfessional = false;
    },
  },
});
export const { professionalLogIn, professionalLogOut } =
  authProfessional.actions;
export default authProfessional.reducer;
