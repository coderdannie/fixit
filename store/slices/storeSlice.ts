import { userType } from "@/types/app";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoreSliceProps {
  isUserOnboarded: boolean;
  type: userType;
  screen: string;
}

const initialState: StoreSliceProps = {
  isUserOnboarded: false,
  type: "",
  screen: "",
};

const storeSlice = createSlice({
  name: "storeSlice",
  initialState,
  reducers: {
    setIsUserOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isUserOnboarded = action.payload;
    },
    setType: (state, action: PayloadAction<userType>) => {
      state.type = action.payload;
    },
    setScreen: (state, action: PayloadAction<string>) => {
      state.screen = action.payload;
    },
  },
});

export const { setIsUserOnboarded, setType, setScreen } = storeSlice.actions;
export default storeSlice.reducer;
