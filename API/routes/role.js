const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createRole,updateRole,deleteRole,getRolesByUserId } = require('../controllers/role');

const router = Router();



router.post('/role', createRole);
router.patch('/update-role/', verifyPermissions, updateRole);
router.delete('/delete-role/:id', verifyPermissions, deleteRole);
router.get('/get-roles/', verifyPermissions, getRolesByUserId);



module.exports = router;