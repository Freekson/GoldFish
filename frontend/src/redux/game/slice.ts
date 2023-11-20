import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FilterRespType,
  GameFilterParamsType,
  GameParamsType,
  gameState,
  IGame,
  Status,
} from "./types";
import axios from "axios";

const initialState: gameState = {
  gameData: [],
  status: Status.LOADING,
};

const createGameAsyncThunk = (name: string, url: string) =>
  createAsyncThunk<IGame[]>(`game/${name}`, async () => {
    const { data } = await axios.get<IGame[]>(url);
    return data;
  });

const fetchAllGames = createGameAsyncThunk("fetchAllGames", "/api/games");
const fetchDiscountedGames = createGameAsyncThunk(
  "fetchDiscountedGames",
  "/api/games/discounted"
);
const fetchHomePageProducts = createGameAsyncThunk(
  "fetchHomePageProducts",
  "/api/games/combined-top"
);
export const fetchProductPageGames = createAsyncThunk<IGame[], GameParamsType>(
  "game/fetchProductPageGames",
  async ({ id }) => {
    const { data } = await axios.get<IGame[]>(
      `/api/games/product-page-combined/${id}`
    );
    return data;
  }
);
export const fetchFilteredGames = createAsyncThunk<
  FilterRespType,
  GameFilterParamsType
>("game/fetchFilteredGames", async ({ path }) => {
  const { data } = await axios.get<FilterRespType>(`/api/games${path}`);
  return data;
});
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<IGame[]>) {
      state.gameData = action.payload;
    },
  },
  extraReducers: (builder) => {
    [
      fetchAllGames,
      fetchDiscountedGames,
      fetchHomePageProducts,
      fetchProductPageGames,
    ].forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.gameData = [];
        state.status = Status.LOADING;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.gameData = action.payload;
        state.status = Status.SUCCESS;
      });
      builder.addCase(thunk.rejected, (state) => {
        state.gameData = [];
        state.status = Status.ERROR;
      });
    });
    builder.addCase(fetchFilteredGames.pending, (state) => {
      state.gameData = [];
      state.status = Status.LOADING;
    });
    builder.addCase(fetchFilteredGames.fulfilled, (state, action) => {
      state.filterData = action.payload;
      state.status = Status.SUCCESS;
    });
    builder.addCase(fetchFilteredGames.rejected, (state) => {
      state.gameData = [];
      state.status = Status.ERROR;
    });
  },
});
export const { setItems } = gameSlice.actions;
export { fetchAllGames, fetchDiscountedGames, fetchHomePageProducts };
export default gameSlice.reducer;
