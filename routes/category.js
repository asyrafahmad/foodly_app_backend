const router = require('express').Router();
const getCategoryController = require("../controller/CategoryController");

router.post("/", getCategoryController.createCategory);

router.get("/", getCategoryController.getAllCategories);

router.get("/random", getCategoryController.getRandomCategories);

module.exports = router;