import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IPromoCode, Status } from "../../types";
import { promoCodeState } from "./types";
import axios from "axios";

const initialState: promoCodeState = {
  promocodes: [],
  status: Status.LOADING,
};

export const fetchPromoCode = createAsyncThunk<IPromoCode, { code: string }>(
  "promo code/fetchPromoCode",
  async ({ code }) => {
    const { data } = await axios.get<IPromoCode>(`/api/promocodes/${code}`);
    return data;
  }
);

export const activatePromoCode = createAsyncThunk(
  "promo code/activate",
  async (code: string) => {
    const { data } = await axios.put(`/api/promocodes/activate/${code}`);
    return data;
  }
);

const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPromoCode.pending, (state) => {
      state.promocodes = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchPromoCode.fulfilled, (state, action) => {
      state.promocodes[0] = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchPromoCode.rejected, (state) => {
      state.promocodes = [];
      state.status = Status.ERROR;
    });
  },
});

export default promoCodeSlice.reducer;
