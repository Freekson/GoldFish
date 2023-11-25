import { Status, TUser } from "../../types";

export interface userState {
  userData: TUser | null;
  status: Status;
}
