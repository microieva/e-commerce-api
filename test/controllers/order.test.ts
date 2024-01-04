import request from "supertest";
import app from "../../";
import UserService from "../../services/usersService";
import connect, { MongoHelper } from "../dbHelper";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createOrderAsUser } from "../__fixtures__/createOrderAsUser";
import ItemsService from "../../services/itemsService";

describe("Order  controllers", () => {
  let mongoHelper: MongoHelper | undefined; 

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    if (mongoHelper) {
      await mongoHelper.clearDatabase(); 
    }
  });

  afterAll(async () => {
    if (mongoHelper) {
      await mongoHelper.closeDatabase(); 
    }
  });

  test('createOrder', async () => {
    const addedUser = await UserService.createUser({
        id:"",
        name: "user",
        email:"user@email.com",
        password:"122345",
        avatar:"",
        role:"CUSTOMER"
    });

    const userId = addedUser._id.toString();
    const adminToken = await createAdminWithToken()
    const product1 = await createProductAsAdmin(adminToken);
    const product1Id = product1._id.toString();
    const product2 = await createProductAsAdmin(adminToken);
    const product2Id = product2._id.toString();
    const orderRequest = [
      { id: `${product1Id}`, quantity: 2 },
      { id: `${product2Id}`, quantity: 1 },
    ];

    const response = await request(app)
      .post(`/api/v1/orders/checkout/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(orderRequest);
    
    const items = await ItemsService.getAllItems();

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('totalPrice');
    expect(items.length).toBe(2);
  });

  test('getAllOrders - admin only', async () => {
    const adminToken = await createAdminWithToken();
    const order = await createOrderAsUser(adminToken);

    const response = await request(app)
        .get("/api/v1/orders")
        .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.length).toBe(1);
  });

  test('deleteAllOrders - admin only', async () => {
    const adminToken = await createAdminWithToken();
    await createOrderAsUser(adminToken);
    
    const response = await request(app)
      .delete(`/api/v1/orders/orders`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.body).toMatchObject({ msg: 'All orders (and order items) deleted successfuly'})
  });

  test('deleteOrder', async () => {
    const token = await createAdminWithToken();
    const order = await createOrderAsUser(token);
    const orderId = order._id;
    
    const response = await request(app)
      .delete(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toMatchObject({ msg: 'Order deleted successfuly' })
  });
})