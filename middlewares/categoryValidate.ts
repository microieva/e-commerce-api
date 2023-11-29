import { NextFunction, Request, Response } from "express"
import { categorySchema } from "../schemas/categorySchema"

export async function validateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await categorySchema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (error) {
    return res.status(400).json(error)
  }
}
