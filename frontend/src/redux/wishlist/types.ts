import { IGame, Status } from "../../types";

export interface wishlistState {
  items: IGame[] | [];
  status: Status;
}
