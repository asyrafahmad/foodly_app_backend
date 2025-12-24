const router = require('express').Router();
const getFoodController = require("../controller/foodController");
const { verifyVendor } = require("../middleware/verifyToken");

router.post("/", verifyVendor, getFoodController.addFood);

router.get("/search/:search", getFoodController.searchFoods);
router.get("/:id", getFoodController.getFoodById);
router.get("/recommendation/:code", getFoodController.getRandomFoods);
router.get("/restaurant-foods/:id", getFoodController.getFoodsByRestaurant);
router.get("/byCode/:code", getFoodController.getAllFoodsByCode);
router.get("/:category/:code", getFoodController.getFoodsByCategoryAndCode);

module.exports = router;