import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { categoryState, ICategory } from "./types";
import axios from "axios";
import { Status } from "../../types";

const initialState: categoryState = {
  categoryData: [],
  status: Status.LOADING,
};

const createCategoryAsyncThunk = (name: string, url: string) =>
  createAsyncThunk<ICategory[]>(`category/${name}`, async () => {
    const { data } = await axios.get<ICategory[]>(url);
    return data;
  });

const fetchHomeCategories = createCategoryAsyncThunk(
  "fetchHomeCategories",
  "/api/games/top-categories"
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<ICategory[]>) {
      state.categoryData = action.payload;
    },
  },
  extraReducers: (builder) => {
    [fetchHomeCategories].forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.categoryData = [];
        state.status = Status.LOADING;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.categoryData = action.payload;
        state.status = Status.SUCCESS;
      });
      builder.addCase(thunk.rejected, (state) => {
        state.categoryData = [];
        state.status = Status.ERROR;
      });
    });
  },
});
export const { setItems } = categorySlice.actions;
export { fetchHomeCategories };
export default categorySlice.reducer;
