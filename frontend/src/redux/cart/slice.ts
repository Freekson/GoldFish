import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "./types";
import { getCartFromLS } from "../../utils/getCartFromLS";

const { cartItems } = getCartFromLS();

const initialState: CartState = {
  cartItems,
  isPromoActive: false,
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
    },
  },
});
export const { addItem, minusItem, deleteItem, clear } = cartSlice.actions;
export default cartSlice.reducer;
