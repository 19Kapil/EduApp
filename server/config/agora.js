// const express = require("express");
// const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
// require("dotenv").config();
// const router = express.Router();

// // Agora Credentials
// const APP_ID = process.env.AGORA_APP_ID;
// const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// if (!APP_ID || !APP_CERTIFICATE) {
//   console.error("❌ Missing Agora credentials!");
//   process.exit(1);
// }

// // Token Generation Helper Function
// const generateToken = (channelName, uid, role = RtcRole.PUBLISHER) => {
//   const expirationTimeInSeconds = 3600; // 1 hour
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//   return RtcTokenBuilder.buildTokenWithUid(
//     APP_ID,
//     APP_CERTIFICATE,
//     channelName,
//     uid,
//     role,
//     privilegeExpiredTs
//   );
// };

// // Start Call Helper Function
// const startCall = (callerId, receiverId) => {
//   if (!callerId || !receiverId) {
//     throw new Error("Missing callerId or receiverId");
//   }

//   const channelName = `${callerId}_${receiverId}_${Date.now()}`;
//   const uid = Math.floor(Math.random() * 10000); // Random UID for the call
//   const token = generateToken(channelName, uid);

//   return { channelName, token, uid };
// };

// // 🎯 Generate Token API
// router.post("/token", (req, res) => {
//   const { channelName, uid } = req.body;

//   if (!channelName || !uid) {
//     return res.status(400).json({ error: "❌ Missing channelName or uid" });
//   }

//   // Validate UID type
//   const parsedUid = Number(uid);
//   if (isNaN(parsedUid) || parsedUid <= 0) {
//     return res.status(400).json({ error: "❌ Invalid UID" });
//   }

//   try {
//     const token = generateToken(channelName, parsedUid);
//     res.json({ token });
//   } catch (error) {
//     console.error("❌ Error generating token:", error);
//     res.status(500).json({ error: "❌ Token generation failed" });
//   }
// });

// // 🎯 Start Call API (Caller -> Receiver)
// router.post("/start-call", (req, res) => {
//   const { callerId, receiverId } = req.body;

//   if (!callerId || !receiverId) {
//     return res.status(400).json({ error: "❌ Missing callerId or receiverId" });
//   }

//   try {
//     const callDetails = startCall(callerId, receiverId);
//     res.json({ success: true, ...callDetails });
//   } catch (error) {
//     console.error("❌ Error starting call:", error);
//     res.status(500).json({ error: "❌ Failed to start call" });
//   }
// });

// module.exports = router;
