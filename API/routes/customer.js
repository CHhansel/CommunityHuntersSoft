const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { getAllDniTypes} = require('../controllers/customer');
const { createCustomer, getCustomersByUserId,deleteCustomer, updateCustomer } = require("../controllers/customers");

const router = Router();


router.post('/create-customer', createCustomer);
router.patch('/update-customer/:id', updateCustomer);
router.get('/get-customers/', getCustomersByUserId);
router.get('/get-dni_types/', getAllDniTypes);
router.delete('/delete-customer/:id', deleteCustomer);

module.exports = router;