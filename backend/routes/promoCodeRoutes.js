import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import PromoCode from "../models/PromoСodeModel.js";

const promoCodeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: PromoCodes
 *   description: API for managing promo codes
 */

/**
 * @swagger
 * /api/promocodes:
 *   get:
 *     summary: Get all promo codes
 *     description: Retrieve a list of all promo codes.
 *     tags: [PromoCodes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with an array of promo codes.
 *         content:
 *           application/json:
 *             example:
 *               - code: "ABC123"
 *                 isActive: true
 *               - code: "XYZ789"
 *                 isActive: false
 *       404:
 *         description: No promo codes found.
 *         content:
 *           application/json:
 *             example:
 *               message: Promo codes not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

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

/**
 * @swagger
 * /api/promocodes/{code}:
 *   get:
 *     summary: Get a promo code by its name
 *     description: Retrieve details of a specific promo code.
 *     tags: [PromoCodes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Promo code name.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with details of the promo code.
 *         content:
 *           application/json:
 *             example:
 *               code: "ABC123"
 *               isActive: true
 *       404:
 *         description: Promo code not found.
 *         content:
 *           application/json:
 *             example:
 *               message: Promo code not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

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

/**
 * @swagger
 * /api/promocodes/activate/{code}:
 *   put:
 *     summary: Activate a promo code
 *     description: Activate a specific promo code.
 *     tags: [PromoCodes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Promo code name.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promo code activated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Promo code activated successfully
 *       404:
 *         description: Promo code not found.
 *         content:
 *           application/json:
 *             example:
 *               message: Promo code not found
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Server error
 */

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
