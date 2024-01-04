import mongoose, { ObjectId } from "mongoose";
import CategoryRepo from "../models/Category";
import { Category, CreateCategoryInput } from "../types/category";

async function getCategories() {
  const categories = await CategoryRepo.find().exec();
  return categories;
}

async function getCategoryById(categoryId: string) {
  const id = new mongoose.Types.ObjectId(categoryId);
  const category = await CategoryRepo.findById(id);
  return category;
}

async function createCategory(category: CreateCategoryInput) {
  const newCategory = new CategoryRepo(category);
  return await newCategory.save();
}

async function updateCategory(
  categoryId: string,
  updateCategory: Partial<Category>
) {
  const id = new mongoose.Types.ObjectId(categoryId);
  const result = await CategoryRepo.updateOne(
    { _id: id },
    { $set: updateCategory }
  );
  if (!result) {
    return null;
  }

  return await CategoryRepo.findById(id);
}

export async function deleteCategory(categoryId: string) {
  const id = new mongoose.Types.ObjectId(categoryId);
  return await CategoryRepo.findByIdAndDelete(categoryId);
}


export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
