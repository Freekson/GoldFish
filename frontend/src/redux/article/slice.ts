import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IArticle, Status } from "../../types";
import { articleState } from "./types";

const initialState: articleState = {
  article: null,
  articles: [],
  status: Status.LOADING,
  statusAll: Status.LOADING,
};

export const fetchArticle = createAsyncThunk<IArticle, { id: string }>(
  "article/fetchArticle",
  async ({ id }) => {
    const { data } = await axios.get<IArticle>(`/api/article/${id}`);
    return data;
  }
);

export const fetchAuthorArticles = createAsyncThunk<
  IArticle[],
  { token: string }
>("article/fetchAuthorArticles", async ({ token }) => {
  const { data } = await axios.get<IArticle[]>(`/api/article/author-articles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
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

    builder.addCase(fetchAuthorArticles.pending, (state) => {
      state.articles = [];
      state.statusAll = Status.LOADING;
    });
    builder.addCase(fetchAuthorArticles.fulfilled, (state, action) => {
      state.articles = action.payload;
      state.statusAll = Status.SUCCESS;
    });
    builder.addCase(fetchAuthorArticles.rejected, (state) => {
      state.articles = [];
      state.statusAll = Status.ERROR;
    });
  },
});
export const { setStatus } = articleSlice.actions;
export default articleSlice.reducer;
