export enum Status {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

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
