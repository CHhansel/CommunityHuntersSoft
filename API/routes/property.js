const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty, updatePropertyState, getPropertiesByUserId } = require('../controllers/Property');

const router = Router();

router.post('/create-property', createProperty);


// Ruta para actualizar propiedad, requiere autenticacion
router.patch('/update-property/', verifyPermissions, updateProperty);

router.patch('/update-property-state/', verifyPermissions, updatePropertyState);

router.delete('/delete-property/:id', verifyPermissions, deleteProperty);

router.get('/get-properties/', verifyPermissions, getPropertiesByUserId);



module.exports = router;