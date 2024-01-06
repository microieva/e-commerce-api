import mongoose from "mongoose";
import connect, { MongoHelper } from "../dbHelper";
import CategoryRepo from "../../models/Category";
import ProductsService from "../../services/productsService";
import { ProductToCreate } from "product";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";

describe("Product services", () => {
  let mongoHelper: MongoHelper;
  let hoody1: mongoose.Document;
  let productId: string;


  beforeAll(async () => {
    mongoHelper = await connect();
  });

  beforeEach(async () => {
    const adminToken = await createAdminWithToken();
    hoody1 = await createProductAsAdmin(adminToken);
    productId = hoody1._id;
    await createProductAsAdmin(adminToken);
    await createProductAsAdmin(adminToken);
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });


  test("getProducts - should return list of 3 products", async () => {
    const products = await ProductsService.getProducts();
    expect(products.length).toEqual(3);
  });

  test("createProduct - should create a new product", async () => {
    const testCategory = new CategoryRepo({
      name: "Clothes",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
    });

    const category = await testCategory.save();
    const categoryId = category._id.toString();
    const product: ProductToCreate = {
        title: "Another Hoody",
        price: 150,
        description: "Another hoody for your good boy",
        categoryId,
        images: [
            "https://i.imgur.com/p8AjjXS.jpeg"
        ]
      }
    const newProduct = await ProductsService.createProduct(product);
    expect(newProduct).toHaveProperty("_id");
    expect(newProduct?.title).toEqual("Another Hoody");
  });

  test("getProductById - should find one product", async () => {
    const product = await ProductsService.getProductById(productId);

    expect(product?.title).toEqual("Test Product");
    expect(product?.description).toEqual("New product in our shop!");
  });

  test("updateProduct - should update existing product", async () => {
    const updatedProduct = await ProductsService.updateProduct(
      productId.toString(),
      { title: "UPDATED TITLE" }
    );
    expect(updatedProduct?.title).toEqual("UPDATED TITLE");
  });

  test("deleteProduct - should delete exisiting product", async () => {
    await ProductsService.deleteProduct(productId);
    const products = await ProductsService.getProducts();
    expect(products.length).toEqual(2);
  });

  test("getTotalPrice - should return a sum", async () => {

    const testOrderItems = [
      {
        id: productId,
        quantity: 2
      }
    ]
    const totalPrice = await ProductsService.getTotalPrice(testOrderItems);
    expect(totalPrice).toBe(300);
  });

  test("getFilteredProductsByTitlte", async () => {
    const products = await ProductsService.getProducts();
    await ProductsService.updateProduct(
      productId,
      {
        title: "Test Search"
      }
    )
    const query1 = "Test";
    const searchResult1 = await ProductsService.getFilteredProductsByTitle(query1);
    expect(searchResult1.length).toBe(products.length);

    const query2 = "Product";
    const searchResult2 = await ProductsService.getFilteredProductsByTitle(query2);
    expect(searchResult2.length).toBe(products.length-1);
  }); 
});