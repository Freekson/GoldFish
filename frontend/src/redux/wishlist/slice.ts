import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IGame, Status } from "../../types";
import { wishlistState } from "./types";
import axios from "axios";

const initialState: wishlistState = {
  items: [],
  status: Status.SUCCESS,
};

export const fetchWishlist = createAsyncThunk<
  IGame[],
  { token: string; id: string }
>("wishlist/fetchWishlist", async ({ token, id }) => {
  const response = await axios.get<IGame[]>(`/api/wishlist/`, {
    params: { userId: id },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

export const postGame = createAsyncThunk<
  void,
  { token: string; userId: string; gameId: string }
>("wishlist/postGame", async ({ token, userId, gameId }) => {
  await axios.post(
    `/api/wishlist/add`,
    { userId, gameId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
});

export const deleteGame = createAsyncThunk<
  void,
  { token: string; userId: string; gameId: string }
>("wishlist/removeGame", async ({ token, userId, gameId }) => {
  await axios.delete(`/api/wishlist/remove`, {
    data: { userId, gameId },
    headers: { Authorization: `Bearer ${token}` },
  });
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addGame(state, action: PayloadAction<IGame>) {
      state.items = [...state.items, action.payload];
    },
    removeGame(state, action: PayloadAction<IGame>) {
      state.items = state.items.filter(
        (game) => game._id !== action.payload._id
      );
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.pending, (state) => {
      state.items = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchWishlist.rejected, (state) => {
      state.items = [];
      state.status = Status.ERROR;
    });

    builder.addCase(postGame.pending, (state) => {
      state.status = Status.LOADING;
    });
    builder.addCase(postGame.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
    });
    builder.addCase(postGame.rejected, (state) => {
      state.status = Status.ERROR;
    });

    builder.addCase(deleteGame.pending, (state) => {
      state.status = Status.LOADING;
    });
    builder.addCase(deleteGame.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
    });
    builder.addCase(deleteGame.rejected, (state) => {
      state.status = Status.ERROR;
    });
  },
});
export const { addGame, removeGame, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
