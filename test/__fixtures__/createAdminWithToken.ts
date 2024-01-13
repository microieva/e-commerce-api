
import request from "supertest";
import app from "../..";

export async function createAdminWithToken() {
  const testAdmin = {
    name: "Test Admin",
    email: "admin@email.com",
    password: "admin123",
    role: "ADMIN",
    avatar: "https://api.lorem.space/image/face?w=640&h=480&r=867"
  }

  const response = await request(app)
    .post("/api/v1/auth/signup")
    .send(testAdmin);
  return response.body;
}