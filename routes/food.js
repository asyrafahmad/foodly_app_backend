const router = require('express').Router();
const getFoodController = require("../controller/foodController");
const { verifyVendor } = require("../middleware/verifyToken");

router.post("/", verifyVendor, getFoodController.addFood);

router.get("/:id", getFoodController.getFoodById);
router.get("/search/:search", getFoodController.searchFoods);
router.get("/restaurant-foods/:id", getFoodController.getFoodsByRestaurant);
router.get("/:category/:code", getFoodController.getFoodsByCategoryAndCode);
router.get("/recommendation/:code", getFoodController.getRandomFoods);
router.get("/byCode/:code", getFoodController.getAllFoodsByCode);

module.exports = router;