const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  docController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getAllNotificationController,
  markAllNotificationSeenController,
  cancelAppointmentController,
  clearAppointmentHistoryController,
  deleteAllNotificationController,
  deleteAccountController,
  searchDoctorsController,
} = require("../controllers/userController");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "-");

    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgotpassword", forgotPasswordController);

router.post("/getuserdata", authMiddleware, authController);

router.post("/registerdoc", authMiddleware, docController);

router.get("/getalldoctors", authMiddleware, getAllDoctorsControllers);

router.post(
  "/getappointment",
  authMiddleware,
  upload.single("image"),
  appointmentController,
);

router.get("/getuserappointments", authMiddleware, getAllUserAppointments);

router.get("/getallnotification", authMiddleware, getAllNotificationController);

router.post(
  "/markallnotificationseen",
  authMiddleware,
  markAllNotificationSeenController,
);

router.post("/cancelappointment", authMiddleware, cancelAppointmentController);

router.delete(
  "/clearappointmenthistory",
  authMiddleware,
  clearAppointmentHistoryController,
);

router.delete(
  "/deleteallnotification",
  authMiddleware,
  deleteAllNotificationController,
);

router.delete("/deleteaccount", authMiddleware, deleteAccountController);

router.get("/searchdoctors", authMiddleware, searchDoctorsController);

module.exports = router;
