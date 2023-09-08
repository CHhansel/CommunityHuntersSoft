const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty, updatePropertyState, getPropertiesByUserId, updatePropertyContract } = require('../controllers/Property');

const router = Router();



router.post('/create-property', createProperty);
router.patch('/update-property/', verifyPermissions, updateProperty);
router.patch('/update-property-contract/', verifyPermissions, updatePropertyContract);
router.patch('/update-property-state/', verifyPermissions, updatePropertyState);
router.delete('/delete-property/:id', verifyPermissions, deleteProperty);
router.get('/get-properties/', verifyPermissions, getPropertiesByUserId);



module.exports = router;