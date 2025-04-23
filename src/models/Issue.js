const { Schema, model } = require("mongoose");

const IssueSchema = new Schema(
  {
    message: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    response: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Resolved", "InProgress", "Rejected"],
    },
    issueType: {
      type: String,
      required: true,
      enum: [
        "Search Issue",
        "UI/UX Improvement Suggestion",
        "Accessibility Issues",
        "Language Issues",
        "Report Abuse/Spam",
        "Chat/Messaging Issues",
        "Friend Request Issues",
        "Privacy Settings Issue",
        "Location Issues",
        "Verification Issues",
        "Connectivity Issues",
        "Notification Issues",
        "Profile Update Issue",
        "Bug Report",
        "Feature Request",
        "General Query",
        "Account Issues",
        "Payment Issues",
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("Issue", IssueSchema);
