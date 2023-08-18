import { configureStore } from "@reduxjs/toolkit";
import cocktailsSliceReducer from "../pages/Main/features/cocktailsSlice";
import { useDispatch } from "react-redux";
import { initialState } from "../pages/Main/features/cocktailsSlice";

export const store = configureStore({
  reducer: {
    cocktails: cocktailsSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
