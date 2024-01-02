import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

export const getAllUserController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "User Fetched successfully",
      users: users,
      total: users.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong getting all users",
      error: error,
    });
  }
};

export const getSingleUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "Single user fetched successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong getting single user",
      error: error,
    });
  }
};

export const updateUserController = async (req, res) => {
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
      message: "Sorry, Something went wrong getting Update User",
      error: error,
    });
  }
};

export const deleteUserController = (req, res) => {};
