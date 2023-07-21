const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty  } = require('../controllers/Property');

const router = Router();

router.post('/create-property', createProperty);


// Ruta para actualizar propiedad, requiere autenticacion
router.PATCH('/update-property/:id', verifyPermissions, updateProperty);

router.delete('/delete-property/:id', verifyPermissions, deleteProperty);

router.get('/get-properties/:id', verifyPermissions, deleteProperty);

module.exports = router;