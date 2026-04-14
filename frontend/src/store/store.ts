import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import landReducer from "./landSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    land: landReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
