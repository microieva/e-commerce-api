import mongoose from "mongoose"

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const OrderSchema = new Schema({
  id: ObjectId,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  totalAmount: Number
})

export default mongoose.model("Order", OrderSchema, "orders")