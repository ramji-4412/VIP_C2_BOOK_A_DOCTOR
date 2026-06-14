const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerController,
  loginController,
  authController,
  docController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getAllNotificationController,
  markAllNotificationSeenController,
  cancelAppointmentController,
  deleteAllNotificationController,
  searchDoctorsController,
} = require("../controllers/userController");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/register", registerController);

router.post("/login", loginController);

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
  "/deleteallnotification",
  authMiddleware,
  deleteAllNotificationController,
);

router.get("/searchdoctors", authMiddleware, searchDoctorsController);

module.exports = router;
