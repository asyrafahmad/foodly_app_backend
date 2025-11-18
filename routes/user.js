const router = require('express').Router();
const getUserController = require("../controller/userController");

router.get("/", getUserController.getUser);
router.get("/verify_account/:otp", getUserController.verifyAccount);
router.get("/verify_phone/:phone", getUserController.verifyPhone);

router.post("/delete", getUserController.deleteUser);

module.exports = router;