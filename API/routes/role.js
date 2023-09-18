const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createRole,updateRole,deleteRole,getRolesByUserId, getAccessibleModulesByRoleId } = require('../controllers/role');

const router = Router();



router.post('/create-role', createRole);
router.patch('/update-role/', verifyPermissions, updateRole);
router.delete('/delete-role/:id', verifyPermissions, deleteRole);
router.get('/get-roles/', verifyPermissions, getRolesByUserId);
router.get('/get-accessible-modules/:role_id', getAccessibleModulesByRoleId);

module.exports = router;