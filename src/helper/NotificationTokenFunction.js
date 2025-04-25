const NotificationToken = require("../models/Notifications");
const AppError = require("../utils/AppError");

exports.storeNotificationToken = async (userId, fcmToken) => {
  try {
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
    await NotificationToken.findOneAndDelete({ userId });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
