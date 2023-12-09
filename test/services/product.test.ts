import connect, { MongoHelper } from "../dbHelper";
import CategoryRepo from "../../models/Category";
import ProductRepo from "../../models/Product";
import ProductsService from "../../services/productsService";
import {Category} from "../../types/category";
import { ProductToCreate } from "product";
import mongoose from "mongoose";

describe("Category controller", () => {
  let mongoHelper: MongoHelper;

  let productOne: mongoose.Document;
  let productTwo: mongoose.Document;
  let productThree: mongoose.Document;
  let category: Category;

  beforeEach(async () => {
    const categoryInstance = new CategoryRepo({
      name: "Clothes",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
    });

    const category = await categoryInstance.save();
    const firstHoody = new ProductRepo({
      title: "Hoodie1",
      price: 150,
      description: "Cool hoodie for your good boy",
      categoryId: category.id,
      images: [
          "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });
    const secondHoody = new ProductRepo({
      name: "Hoodie2",
      description: "Cool hoodie for your good boy",
      price: 80,
      categoryId: category.id,
      images: [
        "https://i.imgur.com/p8AjjXS.jpeg"
    ]
    });
    const thirdHoody = new ProductRepo({
      name: "Hoodie3",
      description: "Cool hoodie for your good boy",
      price: 54,
      categoryId: category.id,
      images: [
        "https://i.imgur.com/p8AjjXS.jpeg"
      ]
    });
    productOne = await firstHoody.save();
    productTwo = await secondHoody.save();
    productThree = await thirdHoody.save();
  });

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  it("should create a new product", async () => {
    const product: ProductToCreate = {
        title: "Another Hoody",
        price: 150,
        description: "Another hoodie for your good boy",
        categoryId: category.id.toString(),
        images: [
            "https://i.imgur.com/p8AjjXS.jpeg"
        ]
      }
    const newProduct = await ProductsService.createProduct(product);
    expect(newProduct).toHaveProperty("_id");
    expect(newProduct?.title).toEqual("Another Hoody");
  });

  it("should return a list of products", async () => {
    const products = await ProductsService.getAllProducts();
    expect(products.length).toEqual(3);
  });

  it("should find one product", async () => {
    const foundProduct = await ProductsService.getProductById(
      productOne._id.toString()
    );
    expect(foundProduct?.title).toEqual("Hoody1");
    expect(foundProduct?.description).toEqual("Cool hoodie for your good boy");
  });

  it("should update product", async () => {
    const updatedProduct = await ProductsService.updateProduct(
      productOne._id.toString(),
      { title: "Fantastic Hoodie" }
    );
    expect(updatedProduct?.title).toEqual("Fantastic Hoodie");
  });

  it("should delete one product", async () => {
    await ProductsService.deleteProduct(productOne._id.toString());
    const products = await ProductsService.getAllProducts();
    expect(products.length).toEqual(2);
  });
  /*
  test("getFilteredProductsByTitlte", async () => {
    ....
  })
  */
});