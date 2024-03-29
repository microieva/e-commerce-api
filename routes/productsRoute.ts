import express from "express"

import ProductsController from "../controllers/productsController"
import { validateProduct } from "../middlewares/validateProduct"
import { checkAuth as authenticateUser } from "../middlewares/checkAuth"
import { checkPermission as authorizePermission } from "../middlewares/checkPermission"

const router = express.Router();
router.get("/", ProductsController.getProducts);
router.get("/recent/", ProductsController.getMostRecentlyOrderedProducts);
router.get("/search/", ProductsController.getFilteredProductsByTitle);
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
  ProductsController.deleteProduct
);

router.put("/:productId",
  authenticateUser,
  authorizePermission,
  ProductsController.updateProduct
);

export default router