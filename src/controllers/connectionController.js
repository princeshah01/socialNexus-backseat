const ConnectionRequest = require("../models/Connection");
const responseCode = require("../utils/responseCode");
const USER_SAFE_DATA = require("../utils/utilityFunctions").userSafeData;
// view

exports.view = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        const data = {
          _id: row._id,
          userInfo: { ...row.toUserId._doc, isfav: row.isfav },
        };
        return data;
      }
      const data = {
        _id: row._id,
        userInfo: { ...row.fromUserId._doc, isfav: row.isfav },
      };

      return data;
    });
    res.status(responseCode.OK).json({
      data,
      success: true,
      message: "Successfully retrived connections",
    });
  } catch (err) {
    next(err);
  }
};

// block

exports.remove = async (req, res, next) => {
  try {
    // const loggedInUser = req?.user;
    // const { channelId } = req?.body;

    // todo
    /*
    get loggedinUser id and query for connection request that matches channelID and Also has loggedin user 
    update isblocked flag
    now make channel disable so non of them can send message 
    also create a api to unblock or reuse it  (when unblock make isblock disabled & also enable channel to send message)
    */

    res.send("work in progress");
  } catch (error) {
    next(error);
  }
};
