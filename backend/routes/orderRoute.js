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
      status: req.body.status,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "New Order Created", order });
  })
);

orderRouter.get(
  "/last-three",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    const lastThreeOrders = orders.map((order) => ({
      _id: order._id,
      date: order.createdAt,
      status: order.status,
    }));
    res.send(lastThreeOrders);
  })
);

orderRouter.get(
  "/user-orders",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const ordersUpd = orders.map((order) => ({
      _id: order._id,
      date: order.createdAt,
      status: order.status,
      totalPrice: order.totalPrice,
    }));
    res.send(ordersUpd);
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (order) {
      await Order.deleteOne({ _id: orderId });
      res.send({ message: "Order deleted successfully" });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

export default orderRouter;
