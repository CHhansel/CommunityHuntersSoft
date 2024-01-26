const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createRole,updateRole,deleteRole, getAccessibleModulesByRoleId } = require('../controllers/role');
const { insertCompanyRole, getModulesByRoleId,getRolesByUserId } = require('../controllers/roles');

const router = Router();



router.post('/create-role', insertCompanyRole);
router.patch('/update-role/',  updateRole);
router.delete('/delete-role/:id', deleteRole);
router.get('/get-roles/', getRolesByUserId);
router.get('/get-accessible-modules/:role_id', getAccessibleModulesByRoleId);

module.exports = router;