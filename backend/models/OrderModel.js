import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        image_link: { type: String, required: true },
        price: { type: Number, required: true },
        average_rating: { type: Number, required: true },
        review_count: { type: Number, required: true },
        publisher: { type: String, required: true },
        discount: { type: Number, required: false },
        release_year: { type: Number, required: true },
        quantity: { type: String, required: false },
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
          required: true,
        },
      },
    ],
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      house: { type: String, required: true },
      flat: { type: String, required: false },
    },
    contact: {
      name: { type: String, required: true },
      surname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    deliveryPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    userDiscount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveryMethod: { type: String, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
