import { IPromoCode, Status } from "../../types";

export interface promoCodeState {
  promocodes: IPromoCode[];
  status: Status;
}
