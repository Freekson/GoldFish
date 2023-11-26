import { IGame } from "../../types";

export interface CartState {
  cartItems: IGame[];
  isPromoActive: boolean;
  promo?: number;
}
