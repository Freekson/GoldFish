import { IPromoCode } from "../types";

export const getPromoCodeFromLS = () => {
  const promocode_ = localStorage.getItem("Promocode");
  const isActive_ = localStorage.getItem("IsPromoActive");

  const promocode: IPromoCode = promocode_ ? JSON.parse(promocode_) : undefined;
  const isActive: boolean = isActive_ ? Boolean(JSON.parse(isActive_)) : false;

  if (promocode) {
    return {
      promocode,
      isActive,
    };
  }
  return {
    isActive,
  };
};
