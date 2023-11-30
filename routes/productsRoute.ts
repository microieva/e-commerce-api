import express from "express"

import ProductController from "../controllers/productsController"
import { validateProduct } from "../middlewares/productValidate"
import { checkAuth as authenticateUser } from "../middlewares/checkAuth"
import { checkPermission as authorizePermission } from "../middlewares/checkPermission"

const router = express.Router()
router.get("/", ProductController.getAllProducts)
router.get("/search/", ProductController.getFilteredProductsByTitle)
router.get("/:productId", ProductController.findOneProduct);


router.post("/",
  validateProduct,
  authenticateUser,
  authorizePermission,
  ProductController.createOneProduct
);

router.delete("/:productId",
  authenticateUser,
  authorizePermission,
  ProductController.deleteOneProduct
);

router.put("/:productId",
  authenticateUser,
  authorizePermission,
  ProductController.updateOneProduct
);

export default router