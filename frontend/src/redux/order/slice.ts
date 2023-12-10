import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IOrder, Status } from "../../types";
import { TOrderList, TOrderProfilePage, orderState } from "./types";
import axios from "axios";

const initialState: orderState = {
  lastOrders: null,
  userOrders: null,
  userOrder: null,
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

export const fetchOrder = createAsyncThunk<
  IOrder,
  { token: string; id: string }
>("order/fetchOrder", async ({ token, id }) => {
  const { data } = await axios.get<IOrder>(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setIsPaid(state) {
      if (state.userOrder) {
        state.userOrder.isPaid = true;
        state.userOrder.status = "Waiting for delivery";
      }
    },
  },
  extraReducers: (builder) => {
    //? last three orders
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

    //? user orders
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

    //? user order
    builder.addCase(fetchOrder.pending, (state) => {
      state.userOrder = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.userOrder = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchOrder.rejected, (state) => {
      state.userOrder = null;
      state.status = Status.ERROR;
    });
  },
});

export const { setIsPaid } = orderSlice.actions;
export default orderSlice.reducer;
