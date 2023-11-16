import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { countState, IGameCount, Status } from "./types";
import axios from "axios";

const initialState: countState = {
  ratingCount: [],
  status: Status.LOADING,
};

const createGameAsyncThunk = (name: string, url: string) =>
  createAsyncThunk<IGameCount[]>(`game/${name}`, async () => {
    const { data } = await axios.get<IGameCount[]>(url);
    return data;
  });

const fetchRatingCount = createGameAsyncThunk(
  "fetchRatingCount",
  "/api/games/ratings-count"
);

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<IGameCount[]>) {
      state.ratingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    [fetchRatingCount].forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.ratingCount = [];
        state.status = Status.LOADING;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.ratingCount = action.payload;
        state.status = Status.SUCCESS;
      });
      builder.addCase(thunk.rejected, (state) => {
        state.ratingCount = [];
        state.status = Status.ERROR;
      });
    });
  },
});
export const { setItems } = countSlice.actions;
export { fetchRatingCount };
export default countSlice.reducer;
