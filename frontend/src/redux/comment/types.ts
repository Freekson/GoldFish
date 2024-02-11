import { IComment, Status } from "../../types";

export type commentState = {
  comments: IComment[] | null;
  status: Status;
};
