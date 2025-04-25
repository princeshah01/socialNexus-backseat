const { model, Schema } = require("mongoose");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fcmTokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1 });

const NotificationToken = model("NotificationToken", notificationSchema);

module.exports = NotificationToken;
