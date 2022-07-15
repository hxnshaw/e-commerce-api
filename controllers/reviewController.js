const Review = require("../models/review");
const Product = require("../models/product");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const productIsValid = await Product.findOne({ productId });

  if (!productIsValid) {
    throw new CustomError.BadRequestError(`No product found for ${productId}`);
  }

  //Restrict Users to one review each per product.
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      `Review already submitted for this product`
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.BadRequestError(`No review found for ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews, No_Of_Reviews: reviews.length });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Review with id ${reviewId} not found`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ message: "Updated successfully", review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `Review with id ${reviewId} not found.`
    );
  }

  checkPermissions(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
};

//Get all the reviews associated with a product.
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
