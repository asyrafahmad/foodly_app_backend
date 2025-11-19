const router = require('express').Router();
const getOrderController = require("../controller/orderController");
const {verifyTokenAndAuthorization} = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAuthorization, getOrderController.placeOrder);

router.get("/", verifyTokenAndAuthorization, getOrderController.getUserOrders);

module.exports = router;