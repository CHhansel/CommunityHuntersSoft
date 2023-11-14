const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty, getPropertiesByCompanyId, updatePropertyContract } = require('../controllers/Property');

const router = Router();



router.post('/create-property', createProperty);
router.patch('/update-property/', updateProperty);
router.patch('/update-property-contract/', updatePropertyContract);
router.delete('/delete-property/:id', verifyPermissions, deleteProperty);
router.get('/get-properties/', getPropertiesByCompanyId);



module.exports = router;