import mongoose, { ObjectId } from "mongoose";

import ProductRepo from "../models/Product.js";
import { Product, ProductToCreate } from "../types/products.js";
import CategoryRepo from "../models/Category.js";
import { Category } from "../types/category.js";
import { ItemRequest } from "../types/itemRequest.js";

async function findAll() {
  const products = await ProductRepo.find().populate("category").exec();
  return products;
}

async function findOne(productId: string) {
  const id = new mongoose.Types.ObjectId(productId);
  const product = await ProductRepo.findById(id);

  return product;
}

async function createOne(product: ProductToCreate) {
  const category: Category | null = await CategoryRepo.findOne({
    _id: product.categoryId,
  });
  if (category) {
    delete product.categoryId;
    product.category = category;
    const newProduct = new ProductRepo(product);
    console.log(newProduct);
    return await newProduct.save();
  }
  return false;
}

async function updateOne(
  productId: string,
  updatesForProduct: Partial<ProductToCreate>
) {
  const id = new mongoose.Types.ObjectId(productId);

  if (!!updatesForProduct.categoryId) {
    const category: Category | null = await CategoryRepo.findOne({
      _id: updatesForProduct.categoryId,
    });

    if (category) {
      delete updatesForProduct.categoryId;
      updatesForProduct.category = category;
    } else {
      return;
    }
  }

  const result = await ProductRepo.updateOne(
    { _id: id },
    { $set: updatesForProduct }
  );

  if (!result) {
    return null;
  }
  return await ProductRepo.findById(id);
}

async function getTotalPrice(
  orderItems: ItemRequest[]
): Promise<number>{
  const inputIds = orderItems.map((item) => item.productId);
  const products = await ProductRepo.find({ _id: inputIds });
  const sum = products.reduce((acc, product) => {
    const inputTargetItem = orderItems.find((item) =>
      product._id.equals(item.productId)
    );
    if (product.price) {
      return !!inputTargetItem
        ? acc + inputTargetItem.quantity * product.price
        : acc;
    }
    return acc;
  }, 0);
  return sum; 
}

async function deleteOne(productId: string) {
  const id = new mongoose.Types.ObjectId(productId);
  return await ProductRepo.findByIdAndDelete(id);
}

export default {
  findOne,
  findAll,
  createOne,
  updateOne,
  deleteOne,
  getTotalPrice,
};
