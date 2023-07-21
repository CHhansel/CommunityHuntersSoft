const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createUser, login, updateUser } = require('../controllers/auth');

const router = Router();

router.post('/create-user', createUser);


// Ruta para actualizar usuario, requiere autenticacion
router.PATCH ('/user-update', verifyPermissions, updateUser);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;