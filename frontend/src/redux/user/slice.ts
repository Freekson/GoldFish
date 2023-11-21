import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types";
import { userState } from "./types";

const data = localStorage.getItem("userInfo");
const userLS: TUser = data ? JSON.parse(data) : null;

const initialState: userState = {
  userData: userLS,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.userData = action.payload;
    },
    logout(state) {
      state.userData = null;
    },
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
