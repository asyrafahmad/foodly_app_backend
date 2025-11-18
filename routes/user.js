const router = require('express').Router();
const getUserController = require("../controller/userController");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", verifyToken, getUserController.getUser);
router.get("/verify_account/:otp", verifyToken, getUserController.verifyAccount);
router.get("/verify_phone/:phone", verifyToken, getUserController.verifyPhone);

router.post("/delete", verifyToken, getUserController.deleteUser);

module.exports = router;