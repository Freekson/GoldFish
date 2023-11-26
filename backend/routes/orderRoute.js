import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({
        ...item,
        game: item._id,
      })),
      address: req.body.address,
      contact: req.body.contact,
      paymentMethod: req.body.paymentMethod,
      deliveryMethod: req.body.deliveryMethod,
      itemsPrice: req.body.itemsPrice,
      deliveryPrice: req.body.deliveryPrice,
      totalPrice: req.body.totalPrice,
      userDiscount: req.body.userDiscount,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

export default orderRouter;
