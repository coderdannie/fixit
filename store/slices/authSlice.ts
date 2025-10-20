import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  data: null | any;
  accessToken: string | null;
  expiresIn: number | null;
}

const initialState: AuthState = {
  data: null,
  accessToken: null,
  expiresIn: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthState>) => {
      const { data, accessToken } = action.payload;
      state.data = data;
      state.accessToken = accessToken;
    },
    clearAuth: () => initialState,
  },
});

export const { setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
