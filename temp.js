const admin = require("./fireBaseConnection");

class NotificationService {
  static async sendNotification(deviceToken, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };
    try {
      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  static async sendNotificationToMany(notificationIds, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
    };
  }
}

module.exports = NotificationService;
const admin = require("firebase-admin");
const Database = require("./Database"); // Your database

class Notification {
  static async sendPushNotification(token, message) {
    try {
      const response = await admin.messaging().send({
        token: token,
        notification: {
          title: message.title,
          body: message.body,
        },
      });
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
      await this.handlePushNotificationError(error, token);
    }
  }

  static async handlePushNotificationError(error, token) {
    if (error.code === "messaging/registration-token-not-registered") {
      console.log(`Token ${token} is no longer valid, marking as inactive.`);
      await Database.removeToken(token); // Remove from DB
    } else {
      console.error("Push notification error:", error);
    }
  }

  static async cleanInactiveTokens() {
    try {
      const tokens = await Database.getAllTokens();
      for (let token of tokens) {
        await this.sendPushNotification(token, {
          title: "Test",
          body: "Test message",
        }).catch((error) => this.handlePushNotificationError(error, token));
      }
    } catch (error) {
      console.error("Error cleaning inactive tokens:", error);
    }
  }

  static async registerToken(userId, token) {
    try {
      await Database.saveToken(userId, token); // Store token in DB
      console.log("Token registered successfully for user:", userId);
    } catch (error) {
      console.error("Error registering token:", error);
    }
  }

  static async removeToken(userId) {
    try {
      await Database.removeToken(userId); // Remove token from DB
      console.log("Token removed successfully for user:", userId);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }
}

module.exports = Notification;
