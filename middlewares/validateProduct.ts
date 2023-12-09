import { NextFunction, Request, Response } from "express"
import { productToCreateSchema } from "../schemas/productSchema"

export async function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await productToCreateSchema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (error) {
    return res.status(400).json(error)
  }
}
