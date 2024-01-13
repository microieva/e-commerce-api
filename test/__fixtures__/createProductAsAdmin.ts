import request from "supertest";
import app from "../..";
import { createCategoryAsAdmin } from "./createCategoryAsAdmin";


export async function createProductAsAdmin(token: string) {
  const category = await createCategoryAsAdmin(token);
  const categoryId = category._id;
  
  const testProduct = {
    title: "Test Product",
    price: 150,
    description: "New product in our shop!",
    categoryId,
    images: ["https://api.lorem.space/image/fashion?w=640&h=480&r=4278"]
  }

  const response = await request(app)
    .post("/api/v1/products")
    .set('Authorization', `Bearer ${token}`)
    .send(testProduct);

  return response.body;
}