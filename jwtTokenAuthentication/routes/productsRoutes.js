import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  getAllProductsController,
  getSingleProduct,
  productPhotoController,
  productFilterController,
  getProductCountController,
  productListController,
  getProductSearchController,
  getProductSimilarController,
  PaymentController,
} from "../controllers/createProductController.js";

import formidable from "express-formidable";

const router = express.Router();

// Router
// create a new product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// update a existing product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// delete a product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// get all products
router.get("/getProducts", getAllProductsController);

// get a single product
router.get("/getSingleProducts/:slug", getSingleProduct);
// product photo
router.get("/product-photo/:pid", productPhotoController);
// product filter checkbox and radio buttons
router.post("/productFilter", productFilterController);

// product count
router.get("/product-count", getProductCountController);

// product list per page
router.get("/product-list/:page", productListController);

// product search
router.get("/product-search/:keyword", getProductSearchController);

// similar products
router.get("/product-similar/:pid/:cid", getProductSimilarController);

//  payment methods
router.post("/payment", requireSignIn, PaymentController);

export default router;
