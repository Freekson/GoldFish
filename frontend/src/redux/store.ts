import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/slice";

import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
