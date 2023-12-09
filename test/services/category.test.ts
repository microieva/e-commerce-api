import connect, { MongoHelper } from "../dbHelper";
import CategoryRepo from "../../models/Category";
import categoriesService from "../../services/categoriesService";
import mongoose from "mongoose";

describe("Category controllers", () => {
  let mongoHelper: MongoHelper;
  let categoryOne: mongoose.Document;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  beforeEach(async () => {
    const categoryInstance = new CategoryRepo({
      name: "Electronics",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
    });

    categoryOne = await categoryInstance.save();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  it("should create a new category", async () => {
    const categoryData = {
      name: "Clothing",
      image: "https://api.lorem.space/image/fashion?w=640&h=480&r=4278",
    };

    const newCategory = await categoriesService.createCategory(categoryData);

    expect(newCategory).toHaveProperty("_id");
    expect(newCategory?.name).toEqual("Clothing");
  });

  it("should return a list of categories", async () => {
    const categories = await categoriesService.getCategories();
    expect(categories.length).toEqual(1); // Assuming there is one category created in beforeEach
  });

  it("should find one category", async () => {
    const foundCategory = await categoriesService.getCategoryById(
      categoryOne._id.toString()
    );
    expect(foundCategory?.name).toEqual("Electronics");
    expect(foundCategory?.image).toEqual(
      "https://api.lorem.space/image/fashion?w=640&h=480&r=4278"
    );
  });

  it("should update category", async () => {
    const updatedCategory = await categoriesService.updateCategory(
      categoryOne._id.toString(),
      { name: "Updated Electronics" }
    );

    expect(updatedCategory?.name).toEqual("Updated Electronics");
  });

  it("should delete one category", async () => {
    await categoriesService.deleteCategory(categoryOne._id.toString());
    const categories = await categoriesService.getCategories();
    expect(categories.length).toEqual(0);
  });
});
