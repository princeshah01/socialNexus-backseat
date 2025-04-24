const { model, Schema } = require("mongoose");

const notificationSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
    },
    isfav: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// compound index is used when we want to make db search fast based on the field

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//middleware for checking if user is sending request to self

// connectionRequestSchema.pre("save", function (next) {
//   if (this.fromUserId.equals(this.toUserId)) {
//     throw new Error("Can't send connection request to your self 😂");
//   }
//   next();
// });

const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
