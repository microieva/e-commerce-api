import request from "supertest";
import app from "../..";
import { createAdminWithToken } from "./createAdminWithToken";
import CategoriesService from '../../services/categoriesService';

export async function createCategoryAsAdmin(token: string) {
  const testCategory = {
    name: "Test Category",
    image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
  }

  // const response = await request(app)
  //   .post("/api/v1/categories")
  //   .set('Authorization', `Bearer ${token}`)
  //   .send(testCategory);
  const category = await CategoriesService.createCategory(testCategory)
  return category;
}