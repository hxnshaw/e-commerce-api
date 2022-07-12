const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

//REGISTER A NEW USER.
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

  //In order to prevent sending sensitive info like passwords, we use createTokenUser so we can pass only the data we need.
  const tokenUser = createTokenUser(user);

  //add cookies to the response.
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
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

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expiresIn: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged out successfully." });
};

module.exports = {
  register,
  login,
  logout,
};
