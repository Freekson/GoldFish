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
  release_year: number;
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
  filterData?: FilterRespType;
  status: Status;
}

export type GameParamsType = {
  id: string;
};

export type GameFilterParamsType = {
  path: string;
};

export type FilterRespType = {
  games: IGame[];
  totalGames: number;
  totalPages: number;
  currentPage: number;
};
