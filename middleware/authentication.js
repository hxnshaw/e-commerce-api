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

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route."
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
