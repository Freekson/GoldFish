import { IUserOrder, Status, TUser } from "../../types";

export interface userState {
  userData: TUser | null;
  status: Status;
  orderData: IUserOrder | null;
}
