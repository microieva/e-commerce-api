import mongoose from "mongoose";

import ProductsRepo from "../models/Product";
import { Product, ProductDTO, ProductToCreate } from "../types/product";
import CategoryRepo from "../models/Category";
import { Category } from "../types/category";
import { OrderRequest } from "../types/order";

async function getProducts() {
  const products = await ProductsRepo.find().populate("category").exec(); 
  return products;
}

async function getProductById(productId: string) {
  const id = new mongoose.Types.ObjectId(productId);
  const product = await ProductsRepo.findById(id).populate("category").exec();
  return product;
}

async function getFilteredProductsByTitle(title:string) {
  const filteredData = await ProductsRepo.find({ title: { $regex: new RegExp(title, 'i') } }).populate("category").exec();
  return filteredData;
}

async function getProductsByCategoryId(categoryId: string){
  const products = await ProductsRepo.find([categoryId]).populate("category").exec();
  return products;
}

async function createProduct(product: ProductToCreate) {
  const category: Category | null = await CategoryRepo.findOne({
    _id: product.categoryId,
  });
  if (category) {
    delete product.categoryId;
    const newProduct: ProductDTO = {...product, category: category};
    const responseProduct = new ProductsRepo(newProduct);
    return await responseProduct.save();
  }
  return null;
}

async function updateProduct(
  productId: string,
  updatesForProductInput: Partial<ProductToCreate>
) {
  const id = new mongoose.Types.ObjectId(productId);
  let updatesWithCategory: Partial<ProductDTO> | undefined;

  if (!!updatesForProductInput.categoryId) {
    const category: Category | null = await CategoryRepo.findOne({
      _id: updatesForProductInput.categoryId,
    });

    if (category) {
      delete updatesForProductInput.categoryId;
      updatesWithCategory = {...updatesForProductInput, category: category};
    } else {
      return;
    }
  }

  const result = await ProductsRepo.updateOne(
    { _id: id },
    { $set: !!updatesWithCategory ? updatesWithCategory : updatesForProductInput }
  );

  if (!result) {
    return null;
  }
  return await ProductsRepo.findById(id);
}

async function getTotalPrice(
  orderItems: OrderRequest[]
): Promise<number>{
  const inputIds = orderItems.map((item) => item.id);
  const products = await ProductsRepo.find({_id: inputIds});
  const sum = products.reduce((acc, product) => {
    const inputTargetItem = orderItems.find((item) =>
      product._id.equals(item.id)
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

async function deleteProduct(productId: string) {
  const id = new mongoose.Types.ObjectId(productId);
  return await ProductsRepo.findByIdAndDelete(id).populate("category");
}

export default {
  getProducts,
  getProductById,
  getFilteredProductsByTitle,
  createProduct,
  updateProduct,
  deleteProduct,
  getTotalPrice,
};
