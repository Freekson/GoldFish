import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Status } from "../../types";
import { TArticleSummary, TCommentsSummary, summaryState } from "./types";

const initialState: summaryState = {
  articleSummary: null,
  commentsSummary: null,
  status: Status.LOADING,
};

export const fetchArticleSummary = createAsyncThunk<
  TArticleSummary,
  { token: string }
>("summary/fetchArticleSummary", async ({ token }) => {
  const { data } = await axios.get<TArticleSummary>(`/api/article/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const fetchCommentsSummary = createAsyncThunk<
  TCommentsSummary,
  { token: string }
>("summary/fetchCommentsSummary", async ({ token }) => {
  const { data } = await axios.get<TCommentsSummary>(`/api/comments/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticleSummary.pending, (state) => {
      state.articleSummary = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchArticleSummary.fulfilled, (state, action) => {
      state.articleSummary = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchArticleSummary.rejected, (state) => {
      state.articleSummary = null;
      state.status = Status.ERROR;
    });

    builder.addCase(fetchCommentsSummary.pending, (state) => {
      state.commentsSummary = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchCommentsSummary.fulfilled, (state, action) => {
      state.commentsSummary = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchCommentsSummary.rejected, (state) => {
      state.commentsSummary = null;
      state.status = Status.ERROR;
    });
  },
});
export default summarySlice.reducer;
