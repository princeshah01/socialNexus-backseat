const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    interestIn: {
      type: String,
      enum: {
        values: ["Male", "Female", "Non-binary"],
        message:
          "invalid Gender . Allowed values for Gender are Male , Female and Others",
      },
    },
    fullName: {
      type: String,
      required: true,
      maxLength: [20, "length for full name can't be more then 20"],
      lowercase: true,
      minlength: [1, "Full name cannot be empty"],
    },

    userName: {
      type: String,
      unique: true,
      required: true,
      maxLength: 20,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 40,
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
    lastPassword: {
      type: [String],
      minLength: 8,
      maxLength: 100,
      default: [],
      trim: true,
      select: false,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Non-binary"],
        message:
          "invalid Gender . Allowed values for Gender are Male , Female and Others",
      },
    },
    dob: {
      type: String,
    },
    age: {
      type: Number,
      // min: [18, "Age must be at least 18."],
      max: [99, "Age cannot be more than 99."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileSetup: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxLength: 50,
    },
    profilePicture: {
      type: String,
      default:
        "https://prince.info.np/static/media/prince.71204db128ccdbebba5c.png",
      // validate: {
      //   validator: function (value) {
      //     const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
      //     return imageExtensions.test(value) && validator.isURL(value);
      //   },
      //   message: "invalid photo url",
      // },
    },
    twoBestPics: {
      type: [String],
    },
    locationName: {
      type: String,
      maxLength: 100,
      lowercase: true,
    },
    locationcoordiantes: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    interest: {
      type: [String],
      default: [],
      lowercase: true,
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "too many interest added there can be only max 10 :( ",
      },
    },
    notificationToken: {
      type: String,
      default: null,
    },
    matches: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },

    lastActive: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const IsPassword = await bcrypt.compare(password, user.password);
  return IsPassword;
};

module.exports = model("User", UserSchema);
