import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IArticle, Status } from "../../types";
import { articleState } from "./types";

const initialState: articleState = {
  article: null,
  status: Status.LOADING,
};

export const fetchArticle = createAsyncThunk<IArticle, { id: string }>(
  "article/fetchArticle",
  async ({ id }) => {
    const { data } = await axios.get<IArticle>(`/api/article/${id}`);
    return data;
  }
);

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticle.pending, (state) => {
      state.article = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchArticle.fulfilled, (state, action) => {
      state.article = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchArticle.rejected, (state) => {
      state.article = null;
      state.status = Status.ERROR;
    });
  },
});
export default articleSlice.reducer;
