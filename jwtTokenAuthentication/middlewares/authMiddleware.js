import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base
export const requireSignIn = (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Invalid Token",
      error: error.message,
    });
  }
};

// Admin Access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    console.log(user);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Admin Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in Admin access",
      error: error.message,
    });
  }
};
