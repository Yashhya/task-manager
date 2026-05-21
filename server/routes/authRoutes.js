const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const { signupValidation, loginValidation } = require("../middleware/validators");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/me", verifyToken, getMe);

module.exports = router;
