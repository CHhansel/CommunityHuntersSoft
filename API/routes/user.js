const { Router } = require("express");

const authenticateToken = require('../middlewares/authenticateToken');
const { createUser, login, updateUser } = require('../controllers/auth');

const router = Router();

router.post('/create-user', createUser);


// Ruta para actualizar usuario, requiere autenticacion
router.put('/user-update/:id', authenticateToken, updateUser);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;