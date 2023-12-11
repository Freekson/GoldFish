import { IGame, IPromoCode } from "../../types";

export interface CartState {
  cartItems: IGame[];
  isPromoActive: boolean;
  promo?: IPromoCode;
}
