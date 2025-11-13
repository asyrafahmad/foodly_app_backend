const router = require('express').Router();
const getRestaurantController = require("../controller/restaurantController");

router.post("/", getRestaurantController.addRestaurant);
router.get("/:code", getRestaurantController.getRandomRestaurants);
router.get("/all/:code", getRestaurantController.getAllNearbyRestaurants);
router.get("/byId/:id", getRestaurantController.getRestaurantById);

module.exports = router;