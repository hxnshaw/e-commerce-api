const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if the user already exists
  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new CustomError.BadRequestError(
      "Email already registered to a User."
    );
  }

  //Make the first user to register the admin.
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //check if email and password parameters are given.
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password.");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials provided.");
  }
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new CustomError.UnauthenticatedError("Invalid credentials provided");
  }

  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  console.log("logout");
};

module.exports = {
  register,
  login,
  logout,
};
