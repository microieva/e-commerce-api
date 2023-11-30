import request from "supertest"
import app from "../../"
import ProductService from "../../services/productsService"
import connect, { MongoHelper } from "../dbHelper"
import { ProductToCreate } from "products";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createCategoryAsAdmin } from "../__fixtures__/createCategoryAsAdmin";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";


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

  it("Should create a product", async () => {
    const token = await createAdminWithToken();
    const category = await createCategoryAsAdmin(token);
    const categoryId = category._id;

    const response = await request(app).post("/api/v1/products").set('Authorization', `Bearer ${token}`).send({
      "title": "Another Hoody",
      "price": 150,
      "description": "Another hoodie for your good boy",
      "categoryId": categoryId,
      "images": [
          "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });

    expect(response.body.product).toHaveProperty("title");

    expect(response.body).toMatchObject({ product: {
        title: "Another Hoody",
        price: 150,
        description: "Another hoodie for your good boy",
        category: category,
        images: [
            "https://i.imgur.com/p8AjjXS.jpeg"
        ]
      } 
    });

    expect(response.body).toEqual({
      product: {
        title: "Another Hoody",
        price: 150,
        description: "Another hoodie for your good boy",
        category: category,
        images: [
          "https://i.imgur.com/p8AjjXS.jpeg"
        ],
        __v: expect.any(Number),
        _id: expect.any(String),
      },
    });
  });

  it("Should not create a product with wrong category id", async () => {
    const token = await createAdminWithToken();

    const response = await request(app).post("/api/v1/products").set('Authorization', `Bearer ${token}`).send({
      "title": "Another Hoody",
      "price": 150,
      "description": "Another hoodie for your good boy",
      "categoryId": "655fb75e8101e7921b193190",
      "images": [
          "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });

    expect(response.body.msg).toBe("Category id is not found");
  });

  it("should return all products", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);

    const response = await request(app).get("/api/v1/products");

    expect(response.body.products.length).toEqual(1);
    expect(response.body.products[0]).toEqual(product);
  });

  it("should return product by id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    const productId = product._id;

    const response = await request(app).get(`/api/v1/products/${productId}`);

    expect(response.body.product).toEqual(product);
  });

  it("should return error if searching product by wrong id", async () => {
    const response = await request(app).get(`/api/v1/products/655fb75e8101e7921b193190`);
    expect(response.status).toEqual(404);
  });

  it("should delete product by id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);
    const productId = product._id;

    const response = await request(app).delete(`/api/v1/products/${productId}`).set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      product: product,
    });
  });

  it("should return error if deleting product by wrong id", async () => {
    const response = await request(app).get(`/api/v1/products/655fb75e8101e7921b193190`);
    expect(response.status).toEqual(404);
    expect(response.body.msg).toBe("Product is not found.");
  });

  it("should update product by id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);

    const productId = product._id;
    const response = await request(app).put(`/api/v1/products/${productId}`).set('Authorization', `Bearer ${token}`).send({
      "title": "Different title",
    });
    expect(response.body.updatedProduct.title).toBe("Different title");
  })

  it("should not update product with non-existing category id", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);

    const productId = product._id;
    const response = await request(app).put(`/api/v1/products/${productId}`).set('Authorization', `Bearer ${token}`).send({
      "categoryId": "655fb75e8101e7921b193190"
    });
    expect(response.body.msg).toEqual('Could not update product');
  })
  /* 
  test("getFilteredProductsByTitle", async () => {
    ...
  })*/
});