
import request from "supertest";
import app from "../..";

export async function createUserWithToken() {
  const testUser = {
    name: "Test User",
    email: "user@email.com",
    password: "user123",
    avatar: "https://api.lorem.space/image/face?w=640&h=480&r=867"
  }

  const response = await request(app)
    .post("/api/v1/auth/signup")
    .send(testUser);
    
  return response.body;
}