const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id: ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res
    .status(StatusCodes.OK)
    .json({ products, No_Of_Products: products.length });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(
      `No Product found with id:${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(
      `No Product found with id:${productId}`
    );
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ message: "Product Deleted successfully" });
};

//Upload Images Via Cloudinary.
const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "Ade E-Commerce-API",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath); //Prevent Storing the images in the local storage
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
};
