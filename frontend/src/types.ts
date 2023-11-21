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
  quantity?: number;
  release_year: number;
}

export interface IGameAll {
  games: IGame[];
  gameCount: number;
}

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isAuthor: boolean;
  experience: number;
  token?: string;
};
