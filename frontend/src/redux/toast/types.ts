export interface toastState {
  toastText: string;
  toastType: toastStatus;
}

export enum toastStatus {
  DEFAULT = "",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
  INFO = "info",
}
