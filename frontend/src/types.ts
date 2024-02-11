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

export interface IOrder {
  _id: string;
  orderItems: IGame[];
  address: TUserAdress;
  contact: TUserContact;
  paymentMethod: string;
  deliveryMethod: string;
  itemsPrice: number;
  deliveryPrice: number;
  totalPrice: number;
  userDiscount: number;
  user: string;
  status: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPromoCode {
  _id: string;
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface IArticle {
  _id: string;
  title: string;
  content: string;
  image: string | null;
  tags: string[];
  author: TUser;
  views: number;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export type TReply = {
  _id: string;
  content: string;
  author: TUser;
  likedBy: string[];
  dislikedBy: string[];
  reportedBy: string[];
  parentComment: string;
  createdAt: string;
  updatedAt: string;
};

export interface IComment {
  _id: string;
  content: string;
  author: TUser;
  likedBy: string[];
  dislikedBy: string[];
  reportedBy: string[];
  replies?: TReply[];
  articleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DateTimeFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
}
