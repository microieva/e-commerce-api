import mongoose from "mongoose";
import connect, { MongoHelper } from "../dbHelper";
import OrdersService from "../../services/ordersService";
import ProductsService from "../../services/productsService";
import UsersService from "../../services/usersService";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createOrderAsUser } from "../__fixtures__/createOrderAsUser";


describe("Order services", () => {
  let mongoHelper: MongoHelper;
  let categoryOne: mongoose.Document;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
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

  test("getAllOrders - should return orders collection", async () => {
    const token = await createAdminWithToken();
    await createOrderAsUser(token);
    await createOrderAsUser(token);

    const orders = await OrdersService.getAllOrders();
    expect(orders.length).toEqual(2); 
  });

  test("getOrderById - should find one order by id", async () => {
    const token = await createAdminWithToken();
    const testOrder = await createOrderAsUser(token);

    const order = await OrdersService.getOrderById(
      testOrder._id.toString()
    );

    expect(order).toHaveProperty("_id");
  });

  test("deleteOrder - should delete one order by its id", async () => {
    const token = await createAdminWithToken();
    const order = await createOrderAsUser(token);

    const deleted = await OrdersService.deleteOrder(order._id);

    expect(deleted).toBeTruthy();
  })
});
