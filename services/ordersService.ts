import mongoose from "mongoose"
import OrdersRepo from "../models/Order"
import ItemsRepo from "../models/Item"
import ProductsRepo from "../models/Product"
import { Order } from "../types/order"

async function getAllOrders() {
  const orders = await OrdersRepo.find().exec();
  return orders;
}

async function getOrdersByUserId(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);
    const order = await OrdersRepo.find({ userId: id}); 
    return order;
}

async function getOrderById(orderId: string) {
    const id = new mongoose.Types.ObjectId(orderId);
    const order = await OrdersRepo.findOne({ _id: id}); 
    return order;
}

async function getOrderItems(orderId: string) {
    const id = new mongoose.Types.ObjectId(orderId);
    const items = await ItemsRepo.find({ orderId });

    const orderItems = await Promise.all(
            items.map(async (item) => {
                const product = await ProductsRepo.findById(item.productId).populate("category");;
                return { ...product?.toObject(), quantity: item.quantity };
            })
    );
    return orderItems;
}

async function createOrder(userId: string, totalPrice: number) {
    const id = new mongoose.Types.ObjectId(userId);
    const newOrder = new OrdersRepo({ userId: id, totalPrice });
    return await newOrder.save();
}

async function updateOrder(orderId: string, updates: Partial<Order>) {
    const id = new mongoose.Types.ObjectId(orderId);
    const result = await OrdersRepo.updateOne({ _id: id }, { $set: updates });
  
    if (!result) {
      return null;
    }
    return await OrdersRepo.findById(id);
}

async function deleteOrder(orderId: string) {
    const id = new mongoose.Types.ObjectId(orderId);
    return await OrdersRepo.findByIdAndDelete(id);
}

async function deleteAllOrders() {
    return await OrdersRepo.deleteMany({});
}

async function deleteAllOrdersByUserId(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);
    return await OrdersRepo.deleteMany({ "userId": id })
}

export default {
    getAllOrders,
    getOrdersByUserId,
    getOrderById,
    getOrderItems,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteAllOrders,
    deleteAllOrdersByUserId
}