import mongoose from "mongoose";
import connect, { MongoHelper } from "../dbHelper";
import OrdersService from "../../services/ordersService";
import ProductsService from "../../services/productsService";
import UsersService from "../../services/usersService";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createUserWithToken } from "../__fixtures__/createUserWithToken";
import { createOrderAsUser } from "../__fixtures__/createOrderAsUser";


describe("Order services", () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  test("getAllOrders - should return orders collection", async () => {
    const token = await createAdminWithToken();
    await createOrderAsUser(token, 0);
    await createOrderAsUser(token, 0);

    const orders = await OrdersService.getAllOrders();
    expect(orders.length).toEqual(2); 
  });

  test("getOrdersByUserId - should return orders from the same user", async () => {
    const token = await createUserWithToken();
    const order1 = await createOrderAsUser(token, 0);
    const order2 = await createOrderAsUser(token, 0);
    const users = await UsersService.getAllUsers();

    const orders = await OrdersService.getOrdersByUserId(users[0]._id.toString());
    expect(orders.length).toEqual(2); 
    expect(orders[0]._id.toString()).toEqual(order1._id);
    expect(orders[1]._id.toString()).toEqual(order2._id);
  });

  test("getOrderById - should return 1 order by id", async () => {
    const token = await createUserWithToken();
    const testOrder = await createOrderAsUser(token, 0);

    const order = await OrdersService.getOrderById(testOrder._id.toString());
    expect(order?._id.toString()).toEqual(testOrder._id);
  });

  test("getOrderItems - should return array of items by order id", async () => {
    const token = await createUserWithToken();
    const testOrder = await createOrderAsUser(token, 0);

    const items = await OrdersService.getOrderItems(testOrder._id.toString());
    expect(items.length).toBe(2);
    expect(items[0].quantity).toBe(2);
    expect(items[1].quantity).toBe(1);
  });

  test("createOrder - should create a new order", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    
    const testOrder = [{
        id: product._id,
        quantity: 3,
    }];
    const totalPrice = await ProductsService.getTotalPrice(testOrder);
    const users = await UsersService.getAllUsers();
    const userId = users[0]._id.toString();

    const order = await OrdersService.createOrder(userId, totalPrice);

    expect(order).toHaveProperty("_id");
    expect(order.totalPrice).toBe(450);
  });

  test("deleteAllOrders - admin only", async () => {
    const adminToken = await createAdminWithToken();
    const token = await createUserWithToken();
    await createOrderAsUser(token, 0);
    await createOrderAsUser(adminToken, 1);

    const deleted = await OrdersService.deleteAllOrders();
    expect(deleted).toHaveProperty("deletedCount");
    expect(deleted.deletedCount).toBe(2);
  });

  test("deleteOrder - should delete one order by its id", async () => {
    const token = await createAdminWithToken();
    const order = await createOrderAsUser(token, 0);

    const deleted = await OrdersService.deleteOrder(order._id);
    expect(deleted).toBeTruthy();
  });

  test("deleteAllOrdersByUserId", async () => {
    const token = await createUserWithToken();
    const adminToken = await createAdminWithToken();
    await createOrderAsUser(token, 0);
    await createOrderAsUser(adminToken, 1);
    const users = await UsersService.getAllUsers();

    const deleted = await OrdersService.deleteAllOrdersByUserId(users[0]._id.toString());
    expect(deleted.deletedCount).toBe(1);

    const orders = await OrdersService.getAllOrders();
    expect(orders.length).toBe(1);
  })
});
