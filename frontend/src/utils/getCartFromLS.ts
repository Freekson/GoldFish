import { IGame } from "../types";

export const getCartFromLS = () => {
  const data = localStorage.getItem("cartItems");
  const cartItems: IGame[] = data ? JSON.parse(data) : [];

  if (cartItems.length) {
    return {
      cartItems,
    };
  }
  return {
    cartItems: [],
  };
};
