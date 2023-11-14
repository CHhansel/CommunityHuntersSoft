const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createUser, login, updateUser, getUsersPaged,createDniType, recoveryPassword, resetPassword } = require('../controllers/auth');

const router = Router();


router.post('/create-user', createUser);
router.patch ('/user-update', verifyPermissions, updateUser);
router.post('/login', login);
router.get('/get-users', getUsersPaged);
router.post('/create-dni-type', createDniType);
router.post('/recovery-password', recoveryPassword);
router.post('/reset-password', resetPassword);
module.exports = router;