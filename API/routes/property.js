const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty, updatePropertyState, getPropertiesByUserId } = require('../controllers/Property');

const router = Router();

router.post('/create-property', createProperty);


// Ruta para actualizar propiedad, requiere autenticacion
router.patch('/update-property/:id', verifyPermissions, updateProperty);

router.patch('/update-property-state/:id', verifyPermissions, updatePropertyState);

router.delete('/delete-property/:id', verifyPermissions, deleteProperty);

router.get('/get-properties/:id', verifyPermissions, getPropertiesByUserId);

module.exports = router;