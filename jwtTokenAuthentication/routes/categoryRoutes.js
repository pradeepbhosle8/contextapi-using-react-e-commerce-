import express from "express";

import {
  createCategoryController,
  updateCategoryController,
  getAllCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
} from "../controllers/createCategoryController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// routes

// category Create || POST
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Category Update || PUT
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// Category GetAll || GET
router.get("/getCategory", getAllCategoryController);

// Category GetSingle || GET
router.get(
  "/getSingleCategory/:slug",

  getSingleCategoryController
);

// Category Delete || DELETE
router.delete(
  "/deleteCategory/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
