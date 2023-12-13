import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { isAuth } from "../utils.js";

const orderRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing ordeds
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Successful response with a message, order details, and order ID.
 *         content:
 *           application/json:
 *             example:
 *               message: New Order Created
 *               order:
 *                 _id: "1234567890"
 *                 orderItems: [...]
 *                 address: "123 Main St"
 *                 contact: "1234567890"
 *                 paymentMethod: "PayPal"
 *                 deliveryMethod: "Express"
 *                 itemsPrice: 100
 *                 deliveryPrice: 10
 *                 totalPrice: 110
 *                 userDiscount: 5
 *                 user: "0987654321"
 *                 status: "Pending"
 *               orderId: "1234567890"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({
        ...item,
        quantity: item.quantity,
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
    res
      .status(201)
      .send({ message: "New Order Created", order, orderId: order._id });
  })
);

/**
 * @swagger
 * /api/orders/last-three:
 *   get:
 *     summary: Get the last three orders of the user
 *     description: Retrieve the last three orders for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful response with an array of the last three orders.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "1234567890"
 *                 date: "2023-01-01T12:00:00Z"
 *                 status: "Pending"
 *               - _id: "0987654321"
 *                 date: "2022-12-01T12:00:00Z"
 *                 status: "Delivered"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */

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

/**
 * @swagger
 * /api/orders/user-orders:
 *   get:
 *     summary: Get all orders of the user
 *     description: Retrieve all orders for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful response with an array of all user orders.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "1234567890"
 *                 date: "2023-01-01T12:00:00Z"
 *                 status: "Pending"
 *                 totalPrice: 110
 *               - _id: "0987654321"
 *                 date: "2022-12-01T12:00:00Z"
 *                 status: "Delivered"
 *                 totalPrice: 90
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */

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

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Delete a specific order for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with a message.
 *         content:
 *           application/json:
 *             example:
 *               message: Order deleted successfully
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 */

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

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieve details of a specific order for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with order details.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               orderItems: [...]
 *               address: "123 Main St"
 *               contact: "1234567890"
 *               paymentMethod: "PayPal"
 *               deliveryMethod: "Express"
 *               itemsPrice: 100
 *               deliveryPrice: 10
 *               totalPrice: 110
 *               userDiscount: 5
 *               user: "0987654321"
 *               status: "Pending"
 *               createdAt: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 */

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark an order as paid
 *     description: Mark a specific order as paid for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             id: "PAYPAL_TRANSACTION_ID"
 *             status: "success"
 *             update_time: "2023-01-01T12:00:00Z"
 *             email_address: "john@example.com"
 *     responses:
 *       200:
 *         description: Successful response with a message and updated order details.
 *         content:
 *           application/json:
 *             example:
 *               message: Order Paid
 *               order:
 *                 _id: "1234567890"
 *                 orderItems: [...]
 *                 address: "123 Main St"
 *                 contact: "1234567890"
 *                 paymentMethod: "PayPal"
 *                 deliveryMethod: "Express"
 *                 itemsPrice: 100
 *                 deliveryPrice: 10
 *                 totalPrice: 110
 *                 userDiscount: 5
 *                 user: "0987654321"
 *                 status: "Waiting for delivery"
 *                 createdAt: "2023-01-01T12:00:00Z"
 *                 paidAt: "2023-01-01T12:01:00Z"
 *                 paymentResult:
 *                   id: "PAYPAL_TRANSACTION_ID"
 *                   status: "success"
 *                   update_time: "2023-01-01T12:00:00Z"
 *                   email_address: "john@example.com"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       404:
 *         description: Order Not Found.
 *         content:
 *           application/json:
 *             example:
 *               message: Order Not Found
 */

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Waiting for delivery";
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
