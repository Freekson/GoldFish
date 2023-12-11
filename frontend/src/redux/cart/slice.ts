import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "./types";
import { getCartFromLS } from "../../utils/getCartFromLS";
import { getPromoCodeFromLS } from "../../utils/getPromoCodeFromLS";

const { cartItems } = getCartFromLS();
const { promocode, isActive } = getPromoCodeFromLS();

const initialState: CartState = {
  cartItems,
  promo: promocode,
  isPromoActive: isActive,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = {
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );
      if (existingItem && existingItem.quantity) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push(newItem);
      }
    },
    minusItem(state, action) {
      const itemId = action.payload._id;
      const existingItem = state.cartItems.find((item) => item._id === itemId);
      if (existingItem?.quantity && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
    },
    deleteItem(state, action) {
      const itemId = action.payload._id;
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId);
    },
    clear(state) {
      state.cartItems = [];
      state.isPromoActive = false;
      state.promo = undefined;
    },
    setPromocode(state, action) {
      state.promo = action.payload;
      state.isPromoActive = true;
    },
  },
});
export const { addItem, minusItem, deleteItem, clear, setPromocode } =
  cartSlice.actions;
export default cartSlice.reducer;
