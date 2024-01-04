import request from "supertest";
import app from "../..";
import { createAdminWithToken } from "./createAdminWithToken";
import { createProductAsAdmin } from "./createProductAsAdmin";
import UsersService from '../../services/usersService';
import { OrderRequest } from "order";

export async function createOrderAsUser(token: string) {
    const adminToken = await createAdminWithToken();
    const product1 = await createProductAsAdmin(adminToken);

    const users = await UsersService.getAllUsers();
    
    const userId = users[0]._id.toString();

    const testOrder: OrderRequest[] = [
        {
            id: product1._id,
            quantity: 2
        }
    ]

  const response = await request(app)
    .post(`/api/v1/orders/checkout/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(testOrder);

  return response.body;
}