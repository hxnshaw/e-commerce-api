const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 7,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

//Hash User Password
UserSchema.pre("save", async function () {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

//check if password is correct.
UserSchema.methods.comparePassword = async function (userPassword) {
  const user = this;
  const isMatch = await bcrypt.compare(userPassword, user.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
