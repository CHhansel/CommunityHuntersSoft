const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty  } = require('../controllers/Property');

const router = Router();

router.post('/create-property', createProperty);


// Ruta para actualizar propiedad, requiere autenticacion
router.put('/property-update/:id', verifyPermissions, updateProperty);




module.exports = router;