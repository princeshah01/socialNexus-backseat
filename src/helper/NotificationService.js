const admin = require("./fireBaseConnection");
const {
  storeNotificationToken,
  deleteNotificationToken,
  getAllFcmToken,
  deleteAllFcmTokens,
  getFcmForAllUser,
} = require("./NotificationDbFunction");
const notificationPayload = require("../utils/notificationpayload");
class NotificationService {
  async storeToken(userId, fcmToken) {
    return await storeNotificationToken(userId, fcmToken);
  }

  async deleteToken(userId, fcmToken) {
    return await deleteNotificationToken(userId, fcmToken);
  }

  async getTokens(userId) {
    return await getAllFcmToken(userId);
  }

  async deleteAllTokens(userId) {
    return await deleteAllFcmTokens(userId);
  }
  async getAllFcmToken(userIDs) {
    return await getFcmForAllUser(userIDs);
  }
  // sending notification to a single user

  async sendNotificationToOne(userId, message, title) {
    try {
      const tokens = await getAllFcmToken(userId);
      if (!tokens || tokens.length === 0) {
        console.log(`no tokens found ${userId}`);
        return false;
      }
      const msg = notificationPayload(tokens, title, message);
      console.log("msg : ", msg);
      const response = await admin.messaging().sendEachForMulticast(msg);

      console.log(`notification sent ${userId}:`, response);
      return true;
    } catch (error) {
      console.error("error sending notification", error);
      return false;
    }
  }

  // sending notification to multiusers
  // later have to set limitation because firebase has 500 pushnotification limit on multicast

  async sendNotificationToMany(userIds, title, message) {
    try {
      let tokens = await this.getAllFcmToken(userIds);
      if (!tokens || tokens.length === 0) {
        console.log("no tokens found for these users");
        return false;
      }
      let msg = notificationPayload(tokens, title, message);
      let response = await admin.messaging().sendEachForMulticast(msg);
      console.log(response);
      return true;
    } catch (error) {
      console.error("error sending notification", error);
      return false;
    }
  }
}

module.exports = new NotificationService();
