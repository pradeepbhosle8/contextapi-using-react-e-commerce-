import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

import JWT from "jsonwebtoken";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // validation
    if (!name) {
      return res.send({ message: "Name Is Required" });
    }
    if (!email) {
      return res.send({ message: "Email Is Required" });
    }
    if (!password) {
      return res.send({ message: "Password Is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone number Is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer  Is Required" });
    }
    if (!address) {
      return res.send({ message: "Address Is Required" });
    }

    // Check User
    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please Login Now",
      });
    }

    // Register user

    const hashedPassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "User successfully registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Registration",
      error: error,
    });
  }
};

///////// Login Function ////////
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email Is Not Registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Password does not match",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error: error,
    });
  }
};

// Forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    console.log(email, answer, newPassword);
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Question is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is required",
      });
    }
    // check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully ",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

export const testController = (req, res) => {
  res.send({
    message: "Token Base Auth Testing Purpose",
  });
};

// get single user orders
export const getUserOrdersController = async (req, res) => {
  try {
    // res.send({
    //   message: "Working with user orders",
    // });
    const orders = await orderModel
      .find({
        buyers: req.user._id,
      })
      .populate("products", "-photo")
      .populate("buyers", "name");
    res.status(200).send({
      success: true,
      message: "Orders Successfully retrieved",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong get order fetch",
      error: error,
    });
  }
};

// get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyers", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong get all orders",
      error: error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(orderId, status);
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Orders Update successfully",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong get order status",
      error: error,
    });
  }
};
