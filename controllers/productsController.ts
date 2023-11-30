import { NextFunction, Request, Response } from "express"

import ProductsService from "../services/productsService"
import ProductsRepo from "../models/Product"
import { ApiError } from "../errors/ApiError"

export async function getAllProducts(_: Request, res: Response) {
  const data = await ProductsService.getAllProducts()
  res.json({ data })
}

export async function findOneProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.productId
  const product = await ProductsService.findOne(productId)

  if (!product) {
    next(ApiError.resourceNotFound("Product is not found."))
    return
  }
  res.json({ product })
}

export async function getFilteredProductsByTitle(
  req: Request,
  res: Response,
  next: NextFunction
){
  const { title } = req.query;
  const data = await ProductsService.getFilteredProductsByTitle(title as string);
  if (!data) {
    next(ApiError.resourceNotFound("Products not found"))
    return
  }
  res.json({ data })
}

export async function createOneProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newProduct = req.body
  const product = await ProductsService.createOne(newProduct)

  if (!product) {
    next(ApiError.resourceNotFound("Category id is not found"));
    return;
  }

  res.status(201).json({ product })
}

export async function deleteOneProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.productId;
  const product = await ProductsService.deleteOne(productId);

  if (!product) {
    next(ApiError.resourceNotFound("Product is not found"));
    return;
  }

  res.json({ product });
}

export async function updateOneProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.productId;
  const updatesForProduct = req.body;
  const productToUpdate = await ProductsService.findOne(productId);

  if (!productToUpdate) {
    next(ApiError.resourceNotFound("Product is not found"));
    return;
  }

  const updatedProduct = await ProductsService.updateOne(
    productId,
    updatesForProduct
  );

  if (!updatedProduct) {
    next(ApiError.internal("Could not update product"));
    return;
  }

  res.json({ updatedProduct });
}

export default {
  getAllProducts,
  findOneProduct,
  getFilteredProductsByTitle,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct
}
