// toastSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toastState, toastStatus } from "./types";

const initialState: toastState = {
  toastText: "",
  toastType: toastStatus.DEFAULT,
  showToast: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<toastState>) {
      state.toastText = action.payload.toastText;
      state.toastType = action.payload.toastType;
      state.showToast = true;
    },

    hideToast(state) {
      state.toastText = "";
      state.toastType = toastStatus.DEFAULT;
      state.showToast = false;
    },
  },
});

export const showToast =
  (toast: { toastText: string; toastType: toastStatus }) => (dispatch: any) => {
    dispatch(toastSlice.actions.showToast({ ...toast, showToast: true }));
    const timerId = setTimeout(() => {
      dispatch(toastSlice.actions.hideToast());
    }, 5000);
    return () => clearTimeout(timerId);
  };

export const hideToast = toastSlice.actions.hideToast;

export default toastSlice.reducer;
