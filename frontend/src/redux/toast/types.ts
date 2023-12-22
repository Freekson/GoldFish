export interface toastState {
  toastText: string;
  toastType: toastStatus;
  showToast: boolean;
}

export enum toastStatus {
  DEFAULT = "",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
  INFO = "info",
}
