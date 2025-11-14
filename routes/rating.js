const router = require('express').Router();
const getRatingController = require("../controller/ratingController");

router.post("/", getRatingController.addRating);

router.get("/", getRatingController.checkUserRating);

module.exports = router;