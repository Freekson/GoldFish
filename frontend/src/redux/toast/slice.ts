import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toastState, toastStatus } from "./types";

const initialState: toastState = {
  toastText: "",
  toastType: toastStatus.DEFAULT,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<toastState>) {
      state.toastText = action.payload.toastText;
      state.toastType = action.payload.toastType;
    },

    hideToast(state) {
      state.toastText = "";
      state.toastType = toastStatus.DEFAULT;
    },
  },
});
export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
