import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserOrder, Status, TUser } from "../../types";
import { userState } from "./types";
import axios from "axios";

const data = localStorage.getItem("userInfo");
const userLS: TUser = data ? JSON.parse(data) : null;

const orderData = localStorage.getItem("userOrderData");
const orderDataLS: IUserOrder = orderData ? JSON.parse(orderData) : null;

const initialState: userState = {
  userData: userLS,
  orderData: orderDataLS,
  status: Status.SUCCESS,
};

export const fetchUser = createAsyncThunk<TUser, { token: string }>(
  "user/fetchUser",
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
      state.orderData = null;
    },
    setOrderData(state, action) {
      state.orderData = action.payload;
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
export const { login, logout, setOrderData } = userSlice.actions;
export default userSlice.reducer;
