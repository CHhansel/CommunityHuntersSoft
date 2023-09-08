const { Router } = require("express");
const verifyPermissions = require('../middlewares/authenticateToken');
const { createMembership, updateMembership, deleteMembership, getMemberships } = require('../controllers/Membership');

const router = Router();

router.post('/create-membership', verifyPermissions, createMembership);
router.patch('/update-membership/:id', verifyPermissions, updateMembership);
router.delete('/delete-membership/:id', verifyPermissions, deleteMembership);
router.get('/get-memberships', verifyPermissions, getMemberships);


module.exports = router;
