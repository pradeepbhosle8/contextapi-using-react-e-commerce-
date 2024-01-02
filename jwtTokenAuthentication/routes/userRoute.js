import express from "express";

import {
  getAllUserController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/usersController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get All user Only admin permissions
router.get("/usersAll", requireSignIn, isAdmin, getAllUserController);

// Get Single User
router.get("/User/:id", requireSignIn, isAdmin, getSingleUserController);

// Update user
router.put("/User/:id", requireSignIn, isAdmin, updateUserController);

// delete user
router.delete("/User/:id", requireSignIn, isAdmin, deleteUserController);

export default router;
