const notificationPayload = (tokens, title, body, data = {}) => {
  const message = {
    tokens: tokens,
    notification: {
      title: title,
      body: body,
      //   image:""   //can attach image as well
    },
    data: data, // can send some data like screen to be opened when clicked
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
  };
  return message;
};

module.exports = notificationPayload;
