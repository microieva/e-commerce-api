import mongoose from "mongoose";
import connect, { MongoHelper } from "../dbHelper";
import CategoriesService from "../../services/categoriesService";
import { createCategoryAsAdmin } from "../__fixtures__/createCategoryAsAdmin";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";

describe("Category controllers", () => {
  let mongoHelper: MongoHelper;
  let category: mongoose.Document;
  let categoryId: string;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  beforeEach(async () => {
    const adminToken = await createAdminWithToken();
    category = await createCategoryAsAdmin(adminToken)
    categoryId = category._id;
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  test("createCategory - should create a new category", async () => {
    const testCategory = {
      name: "Test Category",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
    };

    const newCategory = await CategoriesService.createCategory(testCategory);

    expect(newCategory).toHaveProperty("_id");
    expect(newCategory?.name).toEqual("Test Category");
  });

  test("getCategories - admin only", async () => {
    const categories = await CategoriesService.getCategories();
    expect(categories.length).toEqual(1); 
  });

  test("getCategoryById - should find one category", async () => {
    const foundCategory = await CategoriesService.getCategoryById(
      categoryId
    );
    expect(foundCategory?.name).toEqual("Test Category");
    expect(foundCategory?.image).toEqual(
      "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
    );
  });

  test("updateCategory - should update category", async () => {
    const updatedCategory = await CategoriesService.updateCategory(
      categoryId,
      { name: "UPDATED NAME" }
    );
    expect(updatedCategory?.name).toBe("UPDATED NAME");
  });

  test("deletecategory - should delete one category", async () => {
    await CategoriesService.deleteCategory(categoryId);
    const categoriesAfterDeleting = await CategoriesService.getCategories();
    expect(categoriesAfterDeleting.length).toEqual(0);
  });
});
