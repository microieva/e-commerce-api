import express from "express";
import {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController";
import { validateCategory } from "../middlewares/categoryValidate";
import { checkAuth as authenticateUser } from "../middlewares/checkAuth";
import { checkPermission as authorizePermission } from "../middlewares/checkPermission";

const router = express.Router();

router.get("/", authenticateUser, authorizePermission, getCategories);
router.get("/:categoryId", authenticateUser, getOneCategory);
router.post("/",  authenticateUser, createCategory);
router.put("/:categoryId", authenticateUser, updateCategory);
router.delete("/:categoryId", authenticateUser, deleteCategory);

export default router;
