import express from "express"

import ProductsController from "../controllers/productsController"
import { validateProduct } from "../middlewares/validateProduct"
import { checkAuth as authenticateUser } from "../middlewares/checkAuth"
import { checkPermission as authorizePermission } from "../middlewares/checkPermission"

const router = express.Router()
router.get("/", ProductsController.getAllProducts)
router.get("/search/", ProductsController.getFilteredProductsByTitle)
router.get("/:productId", ProductsController.getProductById);


router.post("/",
  validateProduct,
  authenticateUser,
  authorizePermission,
  ProductsController.createProduct
);

router.delete("/:productId",
  authenticateUser,
  authorizePermission,
  ProductsController.deleteOneProduct
);

router.put("/:productId",
  authenticateUser,
  authorizePermission,
  ProductsController.updateProduct
);

export default router