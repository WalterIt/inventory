const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// GET PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  res.send("Get all Products");
});

// GET A SINGLE PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  res.send("Get a Product");
});

// CREATE A PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validations
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please, fill in all fields!");
  }

  // TO DO: IMAGE UPLOAD
  let fileData = {};

  if (req.file) {
    // Save File to Cloudinary
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded!");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create new Product
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// UPDATE A PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  res.send("Update a Product");
});

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  res.send("Delete a Product");
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
