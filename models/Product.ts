// models/Product.ts
import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
}, 
{ 
  timestamps: true 
}
)

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)