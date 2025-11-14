const router = require('express').Router();
const getFoodController = require("../controller/foodController");

router.post("/", getFoodController.addFood);

router.get("/:id", getFoodController.getFoodById);
router.get("/search/:search", getFoodController.searchFoods);
router.get("/restaurant-foods/:id", getFoodController.getFoodsByRestaurant);
router.get("/:category/:code", getFoodController.getFoodsByCategoryAndCode);
router.get("/recommendation/:code", getFoodController.getRandomFoods);

module.exports = router;