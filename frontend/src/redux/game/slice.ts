import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { gameState, IGame, Status } from "./types";
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

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<IGame[]>) {
      state.gameData = action.payload;
    },
  },
  extraReducers: (builder) => {
    [fetchAllGames, fetchDiscountedGames, fetchHomePageProducts].forEach(
      (thunk) => {
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
      }
    );
  },
});
export const { setItems } = gameSlice.actions;
export { fetchAllGames, fetchDiscountedGames, fetchHomePageProducts };
export default gameSlice.reducer;
