import { IArticle, Status } from "../../types";

export interface articleState {
  article: IArticle | null;
  articles: IArticle[];
  filterData?: FilterRespType;
  status: Status;
  statusAll: Status;
}

export type FilterRespType = {
  articles: IArticle[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
};

export type ArtilceFilterParamsType = {
  path: string;
};
