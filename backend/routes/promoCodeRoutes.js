import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import PromoCode from "../models/PromoСodeModel.js";

const promoCodeRouter = express.Router();

//TODO make access only for admins
promoCodeRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const promoCodes = await PromoCode.find();

      if (promoCodes.length === 0) {
        return res.status(404).json({ message: "Promo codes not found" });
      }

      res.json(promoCodes);
    } catch (error) {
      res.status(500).send("Server error");
    }
  })
);

promoCodeRouter.get(
  "/:code",
  expressAsyncHandler(async (req, res) => {
    const promoCodeName = req.params.code;

    try {
      const promoCode = await PromoCode.findOne({ code: promoCodeName });

      if (!promoCode) {
        return res.status(404).json({ message: "Promo code not found" });
      }
      res.json(promoCode);
    } catch (error) {
      res.status(500).send("Server error");
    }
  })
);

promoCodeRouter.put(
  "/activate/:code",
  expressAsyncHandler(async (req, res) => {
    const promoCodeName = req.params.code;

    try {
      const promoCode = await PromoCode.findOne({ code: promoCodeName });

      if (!promoCode) {
        return res.status(404).json({ message: "Promo code not found" });
      }

      promoCode.isActive = false;
      await promoCode.save();

      res.json({ message: "Promo code activated successfully" });
    } catch (error) {
      res.status(500).send("Server error");
    }
  })
);

export default promoCodeRouter;
