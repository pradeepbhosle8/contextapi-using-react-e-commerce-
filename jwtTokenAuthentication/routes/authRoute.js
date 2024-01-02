import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getUserOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
// router Object

const router = express.Router();

// routing

// Register || Method POST
router.post("/register", registerController);

// LOGIN || Method POST
router.post("/login", loginController);

// Forgot Password || POST
router.post("/forgotPassword", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin, testController);

// protected Route User
router.get("/userAuth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// protected Route Admin
router.get("/adminAuth", requireSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// order by user id
router.get("/orders", requireSignIn, getUserOrdersController);

// get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
