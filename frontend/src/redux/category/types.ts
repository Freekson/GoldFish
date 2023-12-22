import { Status } from "../../types";

export interface categoryState {
  categoryData: ICategory[];
  status: Status;
}

export interface ICategory {
  _id: string;
  count: number;
  image_link?: string;
}
