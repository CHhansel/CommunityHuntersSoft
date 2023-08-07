const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createCustomer, updateCustomer, getCustomersByUserId, deleteCustomer} = require('../controllers/customer');

const router = Router();


router.post('/create-customer', createCustomer);
router.patch('/update-customer/:id', verifyPermissions, updateCustomer);
router.get('/get-customer/:id', verifyPermissions, getCustomersByUserId);
router.delete('/delete-customer/:id', verifyPermissions, deleteCustomer);

module.exports = router;