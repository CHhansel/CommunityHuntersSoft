const { Router } = require("express");


const { updateAddress,deleteCustomer } = require('../controllers/address_info');

const router = Router();

router.patch('/update-address', updateAddress);


module.exports = router;