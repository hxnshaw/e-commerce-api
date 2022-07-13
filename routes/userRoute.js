const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  getSingleUser,
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.route("/").get(getAllUsers);

router.route("/myProfile").get(authenticateUser, showCurrentUser);

router.route("/updateProfile").patch(authenticateUser, updateUser);

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(getSingleUser);

module.exports = router;
