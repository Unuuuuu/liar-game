import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isInitialAuthLoadingCompleted: boolean;
}

const initialState: AuthState = {
  isInitialAuthLoadingCompleted: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    completeInitialAuthLoading: (state) => {
      state.isInitialAuthLoadingCompleted = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { completeInitialAuthLoading } = authSlice.actions;

export default authSlice;
