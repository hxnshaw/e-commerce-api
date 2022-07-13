const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  //Check if token exists.
  if (!token) {
    throw new CustomError.BadRequestError("Authentication Invalid.");
  }

  try {
    const { userId, name, role, email } = isTokenValid({ token });
    req.user = { userId, name, role, email };
    next();
  } catch (error) {
    throw new CustomError.BadRequestError("Authentication Invalid.");
  }
};

module.exports = { authenticateUser };
