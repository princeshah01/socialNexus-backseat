const AppError = require("../utils/AppError");
const admin = require("./fireBaseConnection");
const NotificationToken = require("../models/Notifications");

class NotificationService {
  static async sendNotification(userId, message) {
    try {
      let tokens = await notificationDbFunctions.getAllFcmToken(userId);
      if (!tokens.length > 0) {
        throw new AppError("no Fcm Found");
      }
    } catch (error) {}
  }
}
