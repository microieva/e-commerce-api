import { NextFunction, Request, Response } from "express"
import ProductsService from "../services/productsService"
import { ApiError } from "../errors/ApiError"

export async function getAllProducts(_: Request, res: Response) {
  const data = await ProductsService.getAllProducts()
  res.json({ data })
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.productId
  const data = await ProductsService.getProductById(productId)

  if (!data) {
    next(ApiError.resourceNotFound("Product is not found."))
    return
  }
  res.json(data)
}

export async function getFilteredProductsByTitle(
  req: Request,
  res: Response,
  next: NextFunction
){
  const { title } = req.query;
  const data = await ProductsService.getFilteredProductsByTitle(title as string);
  res.json({ data })
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newProduct = req.body
  const data = await ProductsService.createProduct(newProduct)

  if (!data) {
    next(ApiError.resourceNotFound("Category id is not found"));
    return;
  }

  res.status(201).json(data)
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
  const productToUpdate = await ProductsService.getProductById(productId);

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
  getProductById,
  getFilteredProductsByTitle,
  createProduct,
  updateOneProduct,
  deleteOneProduct
}
