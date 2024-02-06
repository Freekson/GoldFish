import { Status } from "../../types";

export interface ICountItem {
  _id: string;
  count: number;
}

export interface ICountArticle {
  _id: string;
  name: string;
  count: number;
}

export interface countState {
  ratingCount: ICountItem[];
  categoryCount: ICountItem[];
  publishersCount: ICountItem[];
  authorsCount: ICountArticle[];
  tagsCount: ICountItem[];
  status: Status;
}
