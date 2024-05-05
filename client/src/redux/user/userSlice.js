import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signOutSuccess, signInSuccess } = userSlice.actions;

export default userSlice.reducer;
