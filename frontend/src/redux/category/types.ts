export enum Status {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

export interface categoryState {
  categoryData: ICategory[];
  status: Status;
}

export interface ICategory {
  _id: string;
  count: number;
  image_link?: string;
}
