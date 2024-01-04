import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IComment, Status } from "../../types";
import { comentState } from "./types";

const initialState: comentState = {
  comments: null,
  status: Status.LOADING,
};

export const fetchComments = createAsyncThunk<IComment[], { id: string }>(
  "comment/fetchComments",
  async ({ id }) => {
    const { data } = await axios.get<IComment[]>(`/api/comments/${id}`);
    return data;
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.comments = null;
      state.status = Status.LOADING;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.comments = null;
      state.status = Status.ERROR;
    });
  },
});
export default commentSlice.reducer;
