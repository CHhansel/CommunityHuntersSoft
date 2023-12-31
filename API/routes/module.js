const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { getAccessModulesByUserRole } = require('../controllers/module');

const router = Router();

router.get('/get-access-modules/', verifyPermissions, getAccessModulesByUserRole);


module.exports = router;