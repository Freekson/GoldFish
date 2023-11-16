export enum Status {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

export interface IGameCount {
  _id: number;
  count: number;
}

export interface countState {
  ratingCount: IGameCount[];
  status: Status;
}
