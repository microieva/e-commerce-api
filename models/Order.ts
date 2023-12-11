import mongoose from "mongoose"

const Schema = mongoose.Schema

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  totalPrice: Number,
  paid: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model("Order", OrderSchema, "orders")