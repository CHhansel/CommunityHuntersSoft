const { Router } = require("express");

const verifyPermissions = require('../middlewares/authenticateToken');
const { createUser, login, updateUser, getUsersPaged,getDniTypes,createDniType } = require('../controllers/auth');

const router = Router();


router.post('/create-user', createUser);
router.patch ('/user-update', verifyPermissions, updateUser);
router.post('/login', login);
router.get('/get-users', getUsersPaged);

router.get('/get-dni-type', getDniTypes);
router.post('/create-dni-type', createDniType);
module.exports = router;