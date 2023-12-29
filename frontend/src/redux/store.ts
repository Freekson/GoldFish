import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./game/slice";
import cartReducer from "./cart/slice";
import countReducer from "./count/slice";
import categoryReducer from "./category/slice";
import userReducer from "./user/slice";
import toastReducer from "./toast/slice";
import orderReducer from "./order/slice";
import promoCodeReducer from "./promocode/slice";
import wishlistReducer from "./wishlist/slice";
import articleReducer from "./article/slice";

import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    cart: cartReducer,
    count: countReducer,
    category: categoryReducer,
    user: userReducer,
    toast: toastReducer,
    order: orderReducer,
    promoCode: promoCodeReducer,
    wishlist: wishlistReducer,
    article: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
