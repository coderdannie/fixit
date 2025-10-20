import { authQuery } from "@/apis/authQuery";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileState {
  data: any | null;
}

const initialState: UserProfileState = {
  data: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    clearUserProfile: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authQuery.endpoints.getCurrentLoggedInUser.matchFulfilled,
      (state, { payload }) => {
        state.data = payload?.data ?? null;
      }
    );
  },
});

export const { setUserProfile, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
