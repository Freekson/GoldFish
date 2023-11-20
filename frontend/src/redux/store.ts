import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/slice";
import cartReducer from "./cart/slice";
import countReducer from "./count/slice";
import categoryReduces from "./category/slice";
import userReduces from "./user/slice";
import toastReduces from "./toast/slice";

import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    cart: cartReducer,
    count: countReducer,
    category: categoryReduces,
    user: userReduces,
    toast: toastReduces,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
