import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category created successfully",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error: error,
    });
  }
};

// Update a category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating category",
      error: error,
    });
  }
};

// delete a category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Delete Category Successfully",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting category",
      error: error,
    });
  }
};

// getAll categories
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Categories Fetched successfully",
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting all categories",
      error: error,
    });
  }
};

// getSingleCategory
export const getSingleCategoryController = async (req, res) => {
  try {
    const singleCategory = await categoryModel.findOne({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: "Single category fetched successfully",
      category: singleCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting single category",
      error: error,
    });
  }
};
