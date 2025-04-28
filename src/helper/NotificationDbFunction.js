const NotificationToken = require("../models/Notifications");
const AppError = require("../utils/AppError");
const responseCode = require("../utils/responseCode");

exports.storeNotificationToken = async (userId, fcmToken) => {
  try {
    if (!fcmToken && !userId) {
      throw new AppError("Missing params", responseCode.BadRequest);
    }
    await NotificationToken.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { fcmTokens: fcmToken } },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.deleteNotificationToken = async (userId, fcmToken) => {
  try {
    if (!fcmToken && !userId) {
      throw new AppError("Missing params", responseCode.BadRequest);
    }
    await NotificationToken.findOneAndUpdate(
      { userId: userId },
      { $pull: { fcmTokens: fcmToken } }
    );
    const doc = await NotificationToken.findOne({ userId });
    if (doc && doc.fcmTokens.length === 0) {
      await doc.deleteOne();
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getAllFcmToken = async (userId) => {
  try {
    if (!userId) {
      throw new AppError("missing params", responseCode.BadRequest);
    }
    const fcmTokenOfUser = await NotificationToken.findOne({ userId });
    if (!fcmTokenOfUser) {
      throw new AppError("No Such Token Exist");
    }
    return fcmTokenOfUser?.fcmTokens;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
exports.deleteAllFcmTokens = async (userId) => {
  try {
    if (!userId) {
      throw new AppError("missing params", responseCode.BadRequest);
    }
    await NotificationToken.findOneAndDelete({ userId });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getFcmForAllUser = async (userIDs) => {
  try {
    if (!userIDs || userIDs.length === 0) {
      throw new AppError("Missing params", responseCode.BadRequest);
    }
    const users = await NotificationToken.find({
      userId: { $in: userIDs },
    }).select("fcmTokens");
    return users.flatMap((user) => user.fcmTokens || []);
  } catch (error) {
    return [];
  }
};
