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
    ageRange: {
      type: [Number],
      default: [18, 99],
      validate: {
        validator: function (value) {
          const [min, max] = value;
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            min >= 18 &&
            max <= 99 &&
            max > min
          );
        },
        message: "min ≥ 18, max ≤ 99, and max > min",
      },
    },
    relationShipType: {
      type: String,
      enum: {
        values: [
          "Casual Dating",
          "Long-Term Relationship",
          "Friendship",
          "Networking",
          "Companionship",
          "Marriage",
          "Hookups",
          "Something Serious",
          "Open Relationship",
          "Exploring / Not Sure",
        ],
        message: "Invalid Relation Ship Type",
      },
    },
    zodiacSign: {
      type: String,
      enum: {
        values: [
          "Aries",
          "Taurus",
          "Gemini",
          "Cancer",
          "Leo",
          "Virgo",
          "Libra",
          "Scorpio",
          "Sagittarius",
          "Capricorn",
          "Aquarius",
          "Pisces",
        ],
        message: "Invalid Zodic Sign",
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
      min: [18, "Age must be at least 18."],
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
      maxLength: 200,
    },
    profilePicture: {
      type: String,
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
        default: "Point",
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
    isPremiumUser: {
      type: Boolean,
      default: false,
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
UserSchema.methods.getForgetToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id, type: "Forget-Password" },
    process.env.JWT_FORGETPASSWORD_VERIFY,
    {
      expiresIn: "1d", // have to change it to 5min
    }
  );
  return token;
};

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const IsPassword = await bcrypt.compare(password, user.password);
  return IsPassword;
};

module.exports = model("User", UserSchema);
