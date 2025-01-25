const express = require('express');
const { login, teacherlogin, logout } = require("../config/login");
const { addUser } = require("../config/addUser");
const { addPost } = require("../config/addPost");
const { loadPost, delPost } = require("../config/loadPost");
const { getStudents, getReport, getTeachers } = require("../config/getStudents");
const { addChild } = require("../config/addChild");
const { getChildRegistrationNumber, getChildDetails } = require("../config/getChildInfo");
const {updateAttendance, getAttendance} = require("../config/Attendance");
const {updateActivity, getActivity} = require("../config/Activity");
const {addRoutine, loadRoutine} = require("../config/addRoutine");
const {sendMessage, getMessages, getUnreadCount, markMessagesAsRead} = require("../config/Message");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const db = require("../config/db"); 


const router = express.Router();


router.post("/api/login", (req, res) => login(req, res, db)); // Parent login
router.post("/api/teacherlogin", (req, res) => teacherlogin(req, res, db)); // Teacher login
router.post("/api/logout", (req, res) => logout(req, res)); // Logout

router.post("/api/adduser", (req, res) => addUser(req, res, db));
router.post("/api/addpost", upload.single("image"), (req, res) => addPost(req, res, db));
router.get("/api/posts", (req, res) => loadPost(req, res, db));
router.delete("/api/posts/:id", (req, res) => delPost(req, res, db));

router.get("/api/students", (req, res) => getStudents(req, res, db));
router.get("/api/report", (req, res) => getReport(req, res, db));
router.get("/api/teachers", (req, res) => getTeachers(req, res, db));

router.put("/api/addchild" , (req, res) => addChild(req, res, db));

router.get("/api/users", (req, res) => getChildRegistrationNumber(req, res, db));
router.get("/api/class", (req, res) => getChildDetails(req, res, db));

router.post("/api/attendance", (req, res) => updateAttendance(req, res, db));
router.get("/api/attendance/:registration_number", (req, res) => getAttendance(req, res, db));

router.get("/api/activities/:teacherClass", (req, res) => getActivity(req, res, db));
router.put("/api/activities/:id", (req, res) => updateActivity(req, res, db));

router.put("/api/addRoutine", upload.single("image"), (req, res) => addRoutine(req, res, db));
router.get("/api/routine", (req, res) => loadRoutine(req, res, db));

router.post("/api/sendmessage/:senderid/:receiverid", (req, res) => sendMessage(req, res, db));
router.get("/api/messages/:id1/:id2", (req, res) => getMessages(req, res, db));
router.get("/api/unreadcount/:id1/:id2", (req, res) => getUnreadCount(req, res, db));
router.put("/api/markasread/:id1/:id2", (req, res) => markMessagesAsRead(req, res, db));

module.exports = router;