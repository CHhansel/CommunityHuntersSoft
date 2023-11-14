const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createRole,updateRole,deleteRole,getRolesByUserId, getAccessibleModulesByRoleId } = require('../controllers/role');

const router = Router();



router.post('/create-role', createRole);
router.patch('/update-role/',  updateRole);
router.delete('/delete-role/:id', deleteRole);
router.get('/get-roles/', getRolesByUserId);
router.get('/get-accessible-modules/:role_id', getAccessibleModulesByRoleId);

module.exports = router;