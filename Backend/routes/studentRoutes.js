const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');

router.post("/predict", controller.countMarks);
router.get("/students", controller.getAllStudents);
router.post("/send-history", controller.sendStudentHistory);

module.exports = router;
