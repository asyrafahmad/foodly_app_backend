const router = require('express').Router();
const getRestaurantController = require("../controller/restaurantController");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAuthorization, getRestaurantController.addRestaurant);
router.get("/:code", getRestaurantController.getRandomRestaurants);
router.get("/all/:code", getRestaurantController.getAllNearbyRestaurants);
router.get("/byId/:id", getRestaurantController.getRestaurantById);

module.exports = router;