export interface IGame {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_link: string;
  price: number;
  average_rating: number;
  review_count: number;
  publisher: string;
  discount?: number;
}

export interface IGameAll {
  games: IGame[];
  gameCount?: number;
}

export enum Status {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

export interface gameState {
  gameData: IGame[];
  status: Status;
}

export type GameParamsType = {
  id: string;
};
