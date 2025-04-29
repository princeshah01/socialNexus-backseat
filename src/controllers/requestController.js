const User = require("../models/User");
const ConnectionRequest = require("../models/Connection");
const responseCode = require("../utils/responseCode");
const USER_SAFE_DATA = require("../utils/utilityFunctions").userSafeData;
const AppError = require("../utils/AppError");
const { CreatePrivateChat } = require("../helper/StreamChat");
const notificationService = require("../helper/NotificationService");
// recevied

exports.received = async (req, res, next) => {
  try {
    const loggedInUser = req?.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.status(responseCode.OK).json({
      success: true,
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    next(error);
  }
};

//send

exports.send = async (req, res, next) => {
  const acceptedStatus = ["ignored", "interested"];
  try {
    const fromUserId = req?.user?._id;
    const { toUserId, status } = req?.params;
    console.log(toUserId, status);
    if (!acceptedStatus.includes(status)) {
      throw new AppError(
        `${status} request is Invalid`,
        responseCode.BadRequest
      );
    }
    const existingUser = await User.findById(toUserId);
    console.log(existingUser);
    if (!existingUser) {
      throw new AppError("User Does't Exist", responseCode.ResourceNotFound);
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      throw new AppError("Request already exist", responseCode.Conflict);
    }
    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId: existingUser._id,
      status,
    });
    await newRequest.save();
    res.status(responseCode.EntryCreated).json({
      success: true,
      message:
        status === "ignored"
          ? `you ignored ${existingUser.fullName}`
          : `Interested request has been sent to ${existingUser.fullName}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// review

exports.review = async (req, res, next) => {
  const allowedStatus = ["accepted", "rejected"];
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req?.params;
    if (!allowedStatus.includes(status)) {
      throw new AppError(`${status} is not allowed`, responseCode.BadRequest);
    }
    const connectionReq = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionReq) {
      throw new AppError(
        "Connection Request doesn't Exist",
        responseCode.ResourceNotFound
      );
    }
    const anotherUser = await User.findOne({ _id: connectionReq.fromUserId });
    if (status === "accepted") {
      CreatePrivateChat(loggedInUser, anotherUser, connectionReq._id);
      const title = `${loggedInUser.fullName} has accepted your request`;
      const message = `start messaging and Fix Date with ${loggedInUser.fullName}`;
      let response = notificationService.sendNotificationToOne(
        anotherUser._id,
        title,
        message
      );
      if (!response) {
        console.log("failed to send Notification");
      }
    }

    connectionReq.status = status;
    const updatedConnectionReq = await connectionReq.save();

    res.status(responseCode.OK).json({
      success: true,
      message: `Connection request ${status}`,
      data: updatedConnectionReq,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
