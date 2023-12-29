import { IArticle, Status } from "../../types";

export interface articleState {
  article: IArticle | null;
  status: Status;
}
