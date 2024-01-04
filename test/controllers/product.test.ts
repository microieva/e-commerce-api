import request from "supertest"
import app from "../../"
import connect, { MongoHelper } from "../dbHelper"
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createCategoryAsAdmin } from "../__fixtures__/createCategoryAsAdmin";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";
import ProductsService from '../../services/productsService';
import { Product } from '../../types/product';


describe("Product controllers", () => {
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

  test("getProducts - should return all products", async () => {
    const token = await createAdminWithToken();
    await createProductAsAdmin(token);

    const response = await request(app).get("/api/v1/products");

    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toBe("Test Product");
  });


  test("createProduct - should create a product", async () => {
    const token = await createAdminWithToken();
    const category = await createCategoryAsAdmin(token);
    const categoryId = category._id;

    const response = await request(app)
      .post("/api/v1/products")
      .set('Authorization', `Bearer ${token}`)
      .send({       
        "title": "Another Hoody",
        "price": 150,
        "description": "Another hoody for your good boy",
        "categoryId": categoryId,
        "images": [
            "https://i.imgur.com/p8AjjXS.jpeg"
        ]
       });
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Another Hoody");
  });

  test("createProduct - error - should not create a product with wrong category id", async () => {
    const token = await createAdminWithToken();

    const response = await request(app)
      .post("/api/v1/products")
      .set('Authorization', `Bearer ${token}`)
      .send({
        "title": "Another Hoody",
        "price": 150,
        "description": "Another hoody for your good boy",
        "categoryId": "655fb75e8101e7921b193190",
        "images": [
            "https://i.imgur.com/p8AjjXS.jpeg"
        ]
      });

    expect(response.body.msg).toBe("Category id is not found");
  });

  test("getProductById - should return product by id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    const productId = product._id;

    const response = await request(app).get(`/api/v1/products/${productId}`);

    expect(response.body).toEqual(product);
  });

  test("getProductById - error - should return error if product doesnt exist", async () => {
    const response = await request(app).get(`/api/v1/products/655fb75e8101e7921b193190`);
    expect(response.status).toEqual(404);
  });

  test("deleteProduct - should delete product by id", async () => {
    const token = await createAdminWithToken();
    const testProduct = await createProductAsAdmin(token);
    const testProductId = testProduct._id;

    const response = await request(app)
      .delete(`/api/v1/products/${testProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.title).toBe("Test Product")
  });

  test("deleteProduct - error - should return error if deleting product by wrong id", async () => {
    const response = await request(app).get(`/api/v1/products/655fb75e8101e7921b193190`);
    expect(response.status).toEqual(404);
    expect(response.body.msg).toBe("Product is not found.");
  });

  test("updateProduct - should update existing product", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    const productId = product._id;
    const updates = {
      title: "UPDATED TITLE"
    }
    const response = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(response.body.title).toBe("UPDATED TITLE");
  })

  test("updateProduct - error - should not update product with non-existing category id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    const productId = product._id;
    const updates = {
      categoryId: "655fb75e8101e7921b193190"
    }

    const response = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);
    
    expect(response.body.msg).toEqual('Could not update product');
  })
});