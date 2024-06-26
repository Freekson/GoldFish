import { IOrder, Status } from "../../types";

export interface orderState {
  lastOrders: TOrderProfilePage[] | null;
  userOrders: TOrderList[] | null;
  userOrder: IOrder | null
  status: Status;
}

export type TOrderProfilePage = {
  _id: string;
  date: string;
  status: string;
};

export type TOrderList = {
  _id: string;
  date: string;
  status: string;
  totalPrice: number;
};
