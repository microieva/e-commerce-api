import { NextFunction, Request, Response } from "express"
import OrdersService from "../services/ordersService"
import ItemsService from "../services/itemsService"
import ProductsService from "../services/productsService";
import { ApiError } from "../errors/ApiError"
import Item from "../models/Item";
import ItemRepo from '../models/Item';
import { OrderRequest } from "../types/order";

async function getAllOrders(
    _: Request, 
    res: Response, 
    next: NextFunction
) {
  const data = await OrdersService.getAllOrders();
  res.json(data);
}

async function getOrdersByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.params.userId;
    const data = await OrdersService.getOrdersByUserId(userId);
    if (data.length === 0) {
      next(ApiError.resourceNotFound("This user has no orders"));
      return;
    }
    res.json(data);
}

async function getOrderItems(
    req: Request,
    res: Response,
    next: NextFunction
){
    const orderId = req.params.orderId;
    const data = await OrdersService.getOrderItems(orderId);
    if (data.length === 0 ) {
        next(ApiError.resourceNotFound("No order items found"));
        return;
    }
    res.json(data);
}

async function createOrder(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId: string = req.params.userId;
    const arr: OrderRequest[] = req.body; 
    const totalPrice: number = await ProductsService.getTotalPrice(arr);
    const data = await OrdersService.createOrder(userId, totalPrice);
    if (!data) {
        next(ApiError.internal("Order could not be created"));
        return;
    }
    const orderId = data._id

    await Promise.all(
        arr.map(async (item) => {
            const orderItem = new Item({
                orderId,
                productId: item.id,
                quantity: item.quantity,
            });
            const savedItem = await ItemRepo.create(orderItem);

            if (!savedItem) {
                next(ApiError.internal("Item could not be created"));
                return;
            }
        })
    )
    res.status(201).json(data);
}

async function updateOrder(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const id = req.params.orderId;
    const updates = req.body;
    const order = await OrdersService.getOrderById(id);
    if (!order) {
      next(ApiError.resourceNotFound("Order not found"));
      return;
    }
    const data = await OrdersService.updateOrder(id, updates);
    res.status(200).json(data);
}

async function deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const id = req.params.orderId;
    const order = await OrdersService.getOrderById(id);
    if (order === null) {
      next(ApiError.resourceNotFound("Order that you are trying to delete does not exist")); 
      return;
    }
    await OrdersService.deleteOrder(id);
    await ItemsService.deleteItemsByOrderId(id);
    const deletedOrder = await OrdersService.getOrderById(id);
    if (deletedOrder !== null) {
        next(ApiError.internal("Deleting failed")); 
        return;
    }
    res.json({msg: "Order deleted successfuly"});
}

async function deleteAllOrders(
    _: Request, 
    res: Response, 
    next: NextFunction
) {
    await OrdersService.deleteAllOrders();
    await ItemsService.deleteAllItems();
    const deletedOrders = await OrdersService.getAllOrders();
    const deletedItems = await ItemsService.getAllItems();
    if (deletedItems.length>0 && deletedOrders.length>0) {
        next(ApiError.internal("Deleting failed")); 
        return;
    }
    res.json({ msg: 'All orders (and order items) deleted successfuly' });

}

async function deleteAllOrdersByUserId(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    const userId = req.params.userId;
    const orders = await OrdersService.getOrdersByUserId(userId);
    const ids = orders.map(order => order._id)
    await OrdersService.deleteAllOrdersByUserId(userId);
    await ItemsService.deleteItemsFromMultipleOrders(ids);
    const deletedOrders = await OrdersService.getOrdersByUserId(userId);
    if (deletedOrders.length>0) {
        next(ApiError.internal("Deleting failed")); 
        return;
    }
    res.json({ msg: 'Orders deleted successfuly' });
}

export default {
    getAllOrders,
    getOrdersByUserId,
    getOrderItems,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteAllOrders, 
    deleteAllOrdersByUserId
}