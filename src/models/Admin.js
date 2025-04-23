const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AdminSchema = new Schema(
  {
    fullname: {
      type: String,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 50,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "invalid email try something else :( ",
      },
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 100,
      trim: true,
      required: true,
      select: false,
    },
    avatar: {
      type: "string",
    },
    streamId: {
      type: "string",
    },
  },
  { timestamps: true }
);

AdminSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

AdminSchema.methods.validatePassword = async function (password) {
  const user = this;
  const IsPassword = await bcrypt.compare(password, user.password);
  return IsPassword;
};

module.exports = model("Admin", AdminSchema);
