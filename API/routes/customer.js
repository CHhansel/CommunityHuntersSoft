const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createCustomer, updateCustomer, getCustomersByUserId, deleteCustomer, getAllDniTypes} = require('../controllers/customer');

const router = Router();


router.post('/create-customer', createCustomer);
router.patch('/update-customer/:id', updateCustomer);
router.get('/get-customers/', getCustomersByUserId);
router.get('/get-dni_types/', getAllDniTypes);
router.delete('/delete-customer/:id', verifyPermissions, deleteCustomer);

module.exports = router;