import { IComment, Status } from "../../types";

export type comentState = {
  comments: IComment[] | null;
  status: Status;
};
