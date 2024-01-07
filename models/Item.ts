import mongoose from "mongoose"

const Schema = mongoose.Schema

export const ItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order"
  },
  quantity: Number
})

export default mongoose.model("Item", ItemSchema, "items")