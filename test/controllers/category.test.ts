import request from "supertest";
import app from "../../";
import connect, { MongoHelper } from "../dbHelper";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createCategoryAsAdmin } from "../__fixtures__/createCategoryAsAdmin";

describe("Category controllers", () => {
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

  test("getCategories - should return all categories", async () => {
    const token = await createAdminWithToken(); 
    const category = await createCategoryAsAdmin(token); 

    const response = await request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(category);
  });

  test("createCategory - should create a new category", async () => {
    const token = await createAdminWithToken();
    const testCategory = {
      name: "Test Category",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
    }
    const response = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(testCategory);

    expect(response.body).toMatchObject({
        name: "Test Category",
        image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
        __v: expect.any(Number),
        _id: expect.any(String),
    });
  });

  test("getCategoryById - should return category by id", async () => {
    const token = await createAdminWithToken();
    const category = await createCategoryAsAdmin(token);
    const categoryId = category._id;

    const response = await request(app)
      .get(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual(category);
  });

  test("getCategoryById - error - should return error if searching category does not exist", async () => {
    const token = await createAdminWithToken();

    const response = await request(app)
      .get(`/api/v1/categories/6560bc15e37dd99b5eff52d5`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
  });

  test("updateCategory - should update category name", async () => {
    const token = await createAdminWithToken();
    const category = await createCategoryAsAdmin(token);
    const categoryId = category._id;

    const response = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UPDATED NAME",
      });

    expect(response.body.name).toEqual("UPDATED NAME");
  });

  test("deleteCategory - should delete category by id", async () => {
    const token = await createAdminWithToken();
    const category = await createCategoryAsAdmin(token);
    const categoryId = category._id.toString();

    const response = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({msg: "Category was deleted successfuly"}) 
  });

  test("deleteCategory - error - should return error if deleting category by wrong id", async () => {
    const token = await createAdminWithToken();

    const response = await request(app)
      .get(`/api/v1/categories/6560bc15e37dd99b5eff52d5`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.body.msg).toBe("Category not found.");
  });
});
