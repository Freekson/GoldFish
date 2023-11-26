export enum Status {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

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
  token: string;
  image?: string;
};

export type TUserAdress = {
  country: string;
  city: string;
  street: string;
  house: string;
  flat: string;
};

export type TUserContact = {
  name: string;
  surname: string;
  email: string;
  phone: string;
};
export interface IUserOrder {
  address: TUserAdress;
  contact: TUserContact;
  paymentMethod: string;
  deliveryMethod: string;
}
