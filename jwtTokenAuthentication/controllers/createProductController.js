import { create } from "domain";
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import orderModel from "../models/orderModel.js";

// create a New Product instance
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shippingAddress } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    // const products = await productModel.findByIdAndUpdate(
    //   req.params.pid,
    //   { ...req.fields, slug: slugify(name) },
    //   { new: true }
    // );

    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    // console.log(photo);
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong Create product",
      error: error,
    });
  }
};

// update a existing Product
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      quantity,
      shippingAddress,
    } = req.fields;

    const { photo } = req.files;
    // console.log(
    //   name,
    //   slug,
    //   description,
    //   price,
    //   category,
    //   quantity,
    //   photo,
    //   shippingAddress,
    //   photo
    // );
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required" });
      case !description:
        return res.status(500).send({ message: "Description is required" });
      case !price:
        return res.status(500).send({ message: "Price is required" });
      case !category:
        return res.status(500).send({ message: "Category is required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo is required and should be less than 1 mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      // console.log(products.photo);
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong Update product",
      error: error.message,
    });
  }
};

// delete a existing Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong Delete product",
      error: error,
    });
  }
};

// GetAll products
export const getAllProductsController = async (req, res) => {
  try {
    // .limit(12)
    // .sort({ createdAt: -1 });
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo");

    res.status(200).send({
      success: true,
      total: products.length,
      message: "Get all products",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong Get all products",
      error: error.message,
    });
  }
};

// get a Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Get Single product fetched",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong Get single product",
      error: error.message,
    });
  }
};

// product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get product photo",
      error: error.message,
    });
  }
};

// product filter checkbox and radio button

export const productFilterController = async (req, res) => {
  try {
    // console.log(req.body);

    const { checked, minValue, maxValue } = req.body;

    let arg = {};
    if (checked.length > 0) {
      arg.category = checked;
    }
    console.log(minValue, maxValue);
    if (minValue.length && maxValue.length) {
      arg.price = {
        $gte: minValue,
        $lte: maxValue,
      };
    }

    const products = await productModel.find(arg);
    // console.log(products);
    res.status(200).send({
      success: true,
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get product filter",
      error: error.message,
    });
  }
};

// product count
export const getProductCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    // console.log(total);
    res.status(200).send({
      success: true,
      message: "Product count successfully",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get product count",
      error: error.message,
    });
  }
};

// product list per page display
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Product per page 6 list successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get product list",
      error: error.message,
    });
  }
};

// search products list
export const getProductSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: `${keyword}`, $options: "i" } },
          { description: { $regex: `${keyword}`, $options: "i" } },
        ],
      })
      .select("-photo");
    console.log(result);
    res.status(200).send({
      success: true,
      message: "Product search result successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get product search list",
      error: error.message,
    });
  }
};

// similar products
export const getProductSimilarController = async (req, res) => {
  console.log("Working");
  try {
    const { pid, cid } = req.params;
    console.log(pid, cid);
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      message: "ProductSimilar search result successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something went wrong get similar products",
      error: error.message,
    });
  }
};

// payment methods
export const PaymentController = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log(cart);
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    const order = new orderModel({
      products: cart,
      payment: "success",
      buyers: req.user._id,
    }).save();
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sorry, something  went wrong get payment methods",
      error: error.message,
    });
  }
};
