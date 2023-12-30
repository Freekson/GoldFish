import { IArticle, Status } from "../../types";

export interface articleState {
  article: IArticle | null;
  articles: IArticle[];
  status: Status;
  statusAll: Status;
}
