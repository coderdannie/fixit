import type { AppDispatch } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import i18n from "../../src/i18n/config";

const LANGUAGE_KEY = "@app_language";

interface LanguageState {
  currentLanguage: string;
  isLoading: boolean;
}

const initialState: LanguageState = {
  currentLanguage: "en",
  isLoading: false,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLanguage, setLoading } = languageSlice.actions;

// Simplified async action without AppThunk
export const changeLanguage = (languageCode: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      console.log("🔄 Starting language change to:", languageCode);
      dispatch(setLoading(true));

      // Change i18n language
      await i18n.changeLanguage(languageCode);
      console.log("✅ i18n language changed to:", i18n.language);

      // Save to AsyncStorage
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
      console.log("💾 Language saved to AsyncStorage");

      // Update Redux state
      dispatch(setLanguage(languageCode));
      console.log("📦 Redux state updated");
    } catch (error) {
      console.error("❌ Error changing language:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// Load saved language on app start
export const loadLanguage = () => {
  return async (dispatch: AppDispatch) => {
    try {
      console.log("🔍 Loading saved language...");
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      console.log("📖 Saved language from storage:", savedLanguage);

      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        dispatch(setLanguage(savedLanguage));
        console.log("✅ Language loaded:", savedLanguage);
      }
    } catch (error) {
      console.error("❌ Error loading language:", error);
    }
  };
};

export default languageSlice.reducer;
