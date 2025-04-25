let admin = require("firebase-admin");
let serviceAccount = require("../constant/firebaseAdminSdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
