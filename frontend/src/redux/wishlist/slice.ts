import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IGame } from "../../types";
import { userState } from "./types";

const data = localStorage.getItem("userWishlist");
const wishlistLS: IGame[] = data ? JSON.parse(data) : null;

const initialState: userState = {
  items: wishlistLS,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.items = action.payload;
    },
    addGame(state, action: PayloadAction<IGame>) {
      state.items = [...state.items, action.payload];
      localStorage.setItem("userWishlist", JSON.stringify(state.items));
    },
    removeGame(state, action: PayloadAction<IGame>) {
      state.items = state.items.filter(
        (game) => game._id !== action.payload._id
      );
      localStorage.setItem("userWishlist", JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});
export const { setWishlist, addGame, removeGame, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
