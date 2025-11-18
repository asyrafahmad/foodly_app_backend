const router = require('express').Router();
const getAuthController = require("../controller/authController");

router.post("/register", getAuthController.createUser);

router.post("/login", getAuthController.loginUser);

module.exports = router;