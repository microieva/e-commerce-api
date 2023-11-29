import request from "supertest"
import app from "../.."

export async function createCategoryAsAdmin(token: string) {
  const responseCategory = await request(app)
    .post("/api/v1/categories")
    .set('Authorization', `Bearer ${token}`)
    .send({
      "name": "Test category",
      "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
    });

  const category = responseCategory.body.category;

  return category;
}