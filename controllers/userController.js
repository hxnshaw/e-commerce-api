const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new CustomError.BadRequestError(`No User with id: ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).send({ users });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError("Invalid credentials provided.");
  }

  const user = await User.findOneAndUpdate({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  //Passing only important information to the client side.
  const tokenUser = createTokenUser(user);

  //set up cookies because the user details were changed.
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  //Check to see if both values are provided by the user.
  if (!currentPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide valid password.");
  }
  const user = await User.findOne({ _id: req.user.userId });

  //Check if the user is passing the correct password before you allow said user to change it.
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new CustomError.UnauthenticatedError("Invalid credentials provided.");
  }

  user.password = newPassword;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ message: "Password Updated successfully!" });
};

module.exports = {
  getSingleUser,
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
