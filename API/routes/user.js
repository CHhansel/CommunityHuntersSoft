const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createUser, login, updateUser, getUsersPaged,getDniTypes,createDniType, recoveryPassword, resetPassword } = require('../controllers/auth');

const router = Router();


router.post('/create-user', createUser);
router.patch ('/user-update', verifyPermissions, updateUser);
router.post('/login', login);
router.get('/get-users', getUsersPaged);
router.get('/get-dni-type', getDniTypes);
router.post('/create-dni-type', createDniType);
router.post('/recovery-password', recoveryPassword);
router.post('/reset-password', resetPassword);
module.exports = router;