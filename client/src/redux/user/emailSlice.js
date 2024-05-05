// emailSlice.js (assuming this tracks email state)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  error: null,
  loading: false,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    emailAuthSuccess: (state, action) => {
      state.email = action.payload; // Update email state
      state.error = null;
    },
  },
});

export const { emailAuthSuccess } = emailSlice.actions;
export default emailSlice.reducer;
