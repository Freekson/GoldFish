import { DateTimeFormatOptions } from "../types";

export function formatDate(newDate: Date) {
  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    newDate
  );
  return formattedDate;
}
