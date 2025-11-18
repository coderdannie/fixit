import api from "@/apis/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../store/slices/authSlice";
import languageReducer from "../store/slices/languageSlice";
import storeSliceReducer from "../store/slices/storeSlice";
import userProfileReducer from "../store/slices/userProfileSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "storeSlice", "userProfile", "language"],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  storeSlice: storeSliceReducer,
  userProfile: userProfileReducer,
  language: languageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
