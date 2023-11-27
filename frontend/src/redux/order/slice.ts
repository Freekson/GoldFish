import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "../../types";
import { TOrderList, TOrderProfilePage, orderState } from "./types";
import axios from "axios";

const initialState: orderState = {
  lastOrders: null,
  userOrders: null,
  status: Status.LOADING,
};

export const fetchLastThreeOrders = createAsyncThunk<
  TOrderProfilePage[],
  { token: string }
>("order/fetchLastThreeOrders", async ({ token }) => {
  const { data } = await axios.get<TOrderProfilePage[]>(
    `/api/orders/last-three`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
});

export const fetchUserOrders = createAsyncThunk<
  TOrderList[],
  { token: string }
>("order/fetchUserOrders", async ({ token }) => {
  const { data } = await axios.get<TOrderList[]>(`/api/orders/user-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLastThreeOrders.pending, (state) => {
      state.lastOrders = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchLastThreeOrders.fulfilled, (state, action) => {
      state.lastOrders = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchLastThreeOrders.rejected, (state) => {
      state.lastOrders = null;
      state.status = Status.ERROR;
    });

    builder.addCase(fetchUserOrders.pending, (state) => {
      state.userOrders = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.userOrders = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchUserOrders.rejected, (state) => {
      state.userOrders = null;
      state.status = Status.ERROR;
    });
  },
});
export default orderSlice.reducer;
