const processProfileData = require("../helper/ProcessProfileData");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");
const User = require("../models/User");
const { removeNullAndData } = require("../utils/utilityFunctions");

const requiredFields = [
  "fullName",
  "gender",
  "dob",
  "bio",
  "locationName",
  "locationcoordiantes",
  "InterestIn",
  "zodiacSign",
  "relationShipType",
  "profilePicture",
  "interest",
  "ageRange",
];

// setting up profile

exports.setup = async (req, res, next) => {
  try {
    const filteredData = processProfileData({ ...req.body, ...req.files });
    const data = Object.keys(filteredData).filter(
      (k) =>
        filteredData[k] === null ||
        (Array.isArray(filteredData[k]) && filteredData[k].length === 0) ||
        (filteredData[k] === "" && k)
    );
    const missingRequiredFields = requiredFields.filter((field) =>
      data.includes(field)
    );
    if (missingRequiredFields.length > 0) {
      throw new AppError(
        "Please Fill required Fields",
        responseCode.BadRequest
      );
    }
    if (!filteredData) {
      throw new AppError("No Data Found", responseCode.BadRequest);
    }
    const additionalData = {
      isProfileSetup: true,
      age: new Date().getFullYear() - new Date(filteredData.dob).getFullYear(),
    };
    const dataToStore = removeNullAndData(filteredData, additionalData);
    const user = await User.findOneAndUpdate(
      req?.user?._id,
      { $set: dataToStore },
      { new: true, runValidators: true }
    );

    res.status(responseCode.EntryCreated).json({
      success: true,
      message: "Profile Setup Done",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// view

exports.view = async (req, res) => {
  res.status(responseCode.OK).json({
    message: "Retrived Profile Info",
    success: true,
    data: req?.user,
  });
};

// edit

exports.edit = async (req, res, next) => {
  try {
    const filteredData = processProfileData({ ...req.body, ...req.files });
    if (!filteredData) {
      throw new AppError("No Data Found", responseCode.BadRequest);
    }
    const additionalData = {
      isProfileSetup: true,
      age: new Date().getFullYear() - new Date(filteredData.dob).getFullYear(),
    };
    const dataToStore = removeNullAndData(filteredData, additionalData);
    const user = await User.findOneAndUpdate(
      req?.user?._id,
      { $set: dataToStore },
      { new: true, runValidators: true }
    );

    res.status(responseCode.EntryCreated).json({
      success: true,
      message: "Updated profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
