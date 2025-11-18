const router = require('express').Router();
const getRatingController = require("../controller/ratingController");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAuthorization, getRatingController.addRating);

router.get("/", verifyTokenAndAuthorization, getRatingController.checkUserRating);

module.exports = router;