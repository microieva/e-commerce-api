import mongoose from "mongoose";
import connect, { MongoHelper } from "../dbHelper";
import CategoryRepo from "../../models/Category";
import ProductRepo from "../../models/Product";
import ProductsService from "../../services/productsService";
import {Category} from "../../types/category";
import { ProductToCreate } from "product";
import { createAdminWithToken } from "../__fixtures__/createAdminWithToken";
import { createProductAsAdmin } from "../__fixtures__/createProductAsAdmin";

describe("Product services", () => {
  let mongoHelper: MongoHelper;

  let productOne: mongoose.Document;
  let productTwo: mongoose.Document;
  let productThree: mongoose.Document;
  let category: Category;


  beforeAll(async () => {
    mongoHelper = await connect();
  });

  beforeEach(async () => {
    const newCategory = new CategoryRepo({
      name: "Clothes",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
    });

    const category = await newCategory.save();

    const hoody1 = new ProductRepo({
      title: "Hoody1",
      price: 150,
      description: "Cool hoody for your good boy",
      categoryId: category._id,
      images: [
          "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });
    const hoody2 = new ProductRepo({
      name: "Hoody2",
      description: "Cool hoody for your good boy",
      price: 80,
      categoryId: category._id,
      images: [
        "https://i.imgur.com/p8AjjXS.jpeg"
    ]
    });
    const hoody3 = new ProductRepo({
      name: "Hoody3",
      description: "Cool hoody for your good boy",
      price: 54,
      categoryId: category._id,
      images: [
        "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });
    productOne = await hoody1.save();
    productTwo = await hoody2.save();
    productThree = await hoody3.save();
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
    const foundProduct = await ProductsService.getProductById(
      productOne._id.toString()
    );
    expect(foundProduct?.title).toEqual("Hoody1");
    expect(foundProduct?.description).toEqual("Cool hoody for your good boy");
  });

  test("updateProduct - should update existing product", async () => {
    const updatedProduct = await ProductsService.updateProduct(
      productOne._id.toString(),
      { title: "Fantastic Hoody" }
    );
    expect(updatedProduct?.title).toEqual("Fantastic Hoody");
  });

  test("deleteProduct - should delete exisiting product", async () => {
    await ProductsService.deleteProduct(productOne._id.toString());
    const products = await ProductsService.getProducts();
    expect(products.length).toEqual(2);
  });

  test("getTotalPrice - should return a sum", async () => {
    const token = await createAdminWithToken();
    const product = await createProductAsAdmin(token);

    const testOrderItems = [
      {
        id: product._id,
        quantity: 2
      }
    ]
    const totalPrice = await ProductsService.getTotalPrice(testOrderItems);
    expect(product.price).toBe(150);
    expect(totalPrice).toBe(300);
  })
  /*
  test("getFilteredProductsByTitlte", async () => {
    ....
  })
  */
});