const router = require('express').Router();
const getCartController = require("../controller/cartController");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAuthorization , getCartController.addProductToCart);

router.get("/", verifyTokenAndAuthorization, getCartController.getCart);
router.get("/decrement/:id", verifyTokenAndAuthorization, getCartController.decrementProductQuantity);
router.get("/count", verifyTokenAndAuthorization, getCartController.getCartCount);

router.delete("/:id", verifyTokenAndAuthorization, getCartController.decrementProductQuantity);



module.exports = router;