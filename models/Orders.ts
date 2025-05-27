// models/Order.ts

import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Order || mongoose.model("Order", orderSchema)
