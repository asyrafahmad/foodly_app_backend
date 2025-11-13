const router = require('express').Router();
const getFoodController = require("../controller/foodController");

router.post("/", getFoodController.addFood);

router.get("/:id", getFoodController.getFoodById);
router.get("/random/:id", getFoodController.getRandomFoods);
router.get("/search/:search", getFoodController.searchFoods);
router.get("/:category/:code", getFoodController.getFoodsByCategoryAndCode);
router.get("/recommendation/:code", getFoodController.getRandomFoods);
router.get("/restaurant-foods/:id", getFoodController.getFoodsByRestaurant);

module.exports = router;