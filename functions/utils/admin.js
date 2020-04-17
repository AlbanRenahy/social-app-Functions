require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = require("../../service-accounts/social-app-c4995-firebase-adminsdk-xcmas-3d1913d5a1.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
  });
  


  const db = admin.firestore();

  module.exports ={ admin, db}