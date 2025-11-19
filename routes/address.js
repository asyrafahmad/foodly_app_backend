const router = require('express').Router();
const getAddressController = require("../controller/addressController");
const {verifyTokenAndAuthorization} = require("../middleware/verifyToken");

router.get("/all", verifyTokenAndAuthorization, getAddressController.getAddresses);
router.get("/default", verifyTokenAndAuthorization, getAddressController.getDefaultAddress);

router.post("/", verifyTokenAndAuthorization, getAddressController.addAddress);

router.delete("/:id", verifyTokenAndAuthorization, getAddressController.deleteAddress);

router.patch("/default/:id", verifyTokenAndAuthorization, getAddressController.setAddressDefault);


module.exports = router;