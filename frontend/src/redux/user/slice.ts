import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status, TUser } from "../../types";
import { userState } from "./types";
import axios from "axios";

const data = localStorage.getItem("userInfo");
const userLS: TUser = data ? JSON.parse(data) : null;

const initialState: userState = {
  userData: userLS,
  status: Status.SUCCESS,
};

export const fetchUser = createAsyncThunk<TUser, { token: string }>(
  "user",
  async ({ token }) => {
    const { data } = await axios.get<TUser>(`/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.userData = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.userData = null;
      state.status = Status.ERROR;
    });
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
