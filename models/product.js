const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter The Product Name"],
      maxlength: [100, "Name Cannot be longer than 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter The Product Description"],
      trim: true,
      maxlength: [1000, "Description cannot be longer than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter The Product Price"],
      default: 0,
    },
    image: {
      type: String,
      default: "/uploads/product.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please Enter The Product Category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please Enter The Product Company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
