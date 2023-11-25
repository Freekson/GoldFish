import { Status } from "../../types";

export interface ICountItem {
  _id: string;
  count: number;
}

export interface countState {
  ratingCount: ICountItem[];
  categoryCount: ICountItem[];
  publishersCount: ICountItem[];
  status: Status;
}
