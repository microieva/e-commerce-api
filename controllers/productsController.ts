import { NextFunction, Request, Response } from "express"

import ProductsService from "../services/productsService"
import { ApiError } from "../errors/ApiError"

export async function findAllProduct(_: Request, res: Response) {
  const data = await ProductsService.findAll()
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
  findOneProduct,
  findAllProduct,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct
}
