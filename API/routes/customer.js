const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createCustomer, updateCustomer, getCustomersByUserId} = require('../controllers/customer');

const router = Router();

router.post('/create-customer', createCustomer);


// Ruta para actualizar propiedad, requiere autenticacion
router.patch('/update-customer/:id', verifyPermissions, updateCustomer);


router.get('/get-customer/:id', verifyPermissions, getCustomersByUserId);

module.exports = router;