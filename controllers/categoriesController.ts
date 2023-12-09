import { NextFunction, Request, Response } from "express";

import CategoriesService from "../services/categoriesService";
import { ApiError } from "../errors/ApiError";

interface ValidationError {
  errors: {
    [field: string]: {
      message: string;
    };
  };
}

export async function getCategories(_: Request, res: Response) {
  const data = await CategoriesService.getCategories();
  res.json(data);
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoryId = req.params.categoryId;
  const data = await CategoriesService.getCategoryById(categoryId);

  if (!data) {
    next(ApiError.resourceNotFound("Category not found."));
    return;
  }
  res.json(data);
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newCategory = req.body;
    const category = await CategoriesService.createCategory(newCategory);
    res.status(201).json({ category });
  } catch (error: any) {
    res.status(500).json({ msg: "something went wrong" });
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoryId = req.params.categoryId;
  const categoryData = req.body;
  const category = CategoriesService.getCategoryById(categoryId);

  if (!category) {
    next(ApiError.resourceNotFound("Category not found"));
    return;
  }

  const result = await CategoriesService.updateCategory(
    categoryId,
    categoryData
  );
  res.status(200).json({ result });
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoryId = req.params.categoryId;
  const category = CategoriesService.getCategoryById(categoryId);

  if (category === null) {
    next(ApiError.resourceNotFound("Category does not exist"));
    return;
  }

  CategoriesService.deleteCategory(categoryId);
  res.status(200).json({ category });
}

export default {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
