import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { countState, ICountItem } from "./types";
import axios from "axios";
import { Status } from "../../types";

const initialState: countState = {
  ratingCount: [],
  categoryCount: [],
  publishersCount: [],
  status: Status.LOADING,
};

export const fetchRatingCount = createAsyncThunk(
  "count/fetchRatingCount",
  async () => {
    const { data } = await axios.get<ICountItem[]>(`/api/games/ratings-count`);
    return data;
  }
);

export const fetchCategoryCount = createAsyncThunk(
  "count/fetchCategoryCount",
  async () => {
    const { data } = await axios.get<ICountItem[]>(
      `/api/games/categories-count`
    );
    return data;
  }
);

export const fetchPublisherCount = createAsyncThunk(
  "count/fetchPublisherCount",
  async () => {
    const { data } = await axios.get<ICountItem[]>(
      `/api/games/publishers-count`
    );
    return data;
  }
);

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<ICountItem[]>) {
      state.ratingCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRatingCount.pending, (state) => {
      state.ratingCount = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchRatingCount.fulfilled, (state, action) => {
      state.ratingCount = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchRatingCount.rejected, (state) => {
      state.ratingCount = [];
      state.status = Status.ERROR;
    });

    builder.addCase(fetchCategoryCount.pending, (state) => {
      state.categoryCount = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchCategoryCount.fulfilled, (state, action) => {
      state.categoryCount = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchCategoryCount.rejected, (state) => {
      state.categoryCount = [];
      state.status = Status.ERROR;
    });

    builder.addCase(fetchPublisherCount.pending, (state) => {
      state.publishersCount = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchPublisherCount.fulfilled, (state, action) => {
      state.publishersCount = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchPublisherCount.rejected, (state) => {
      state.publishersCount = [];
      state.status = Status.ERROR;
    });
  },
});
export const { setItems } = countSlice.actions;
export default countSlice.reducer;
