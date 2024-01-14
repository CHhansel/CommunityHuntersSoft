const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { deleteProperty, updatePropertyContract } = require('../controllers/Property');
const { getPropertiesByCompanyId, insertProperty, updateProperty } = require("../controllers/properties");


const router = Router();



router.post('/create-property', insertProperty);
router.patch('/update-property/', updateProperty);
router.patch('/update-property-contract/', updatePropertyContract);
router.delete('/delete-property/:id', verifyPermissions, deleteProperty);
router.get('/get-properties/', getPropertiesByCompanyId);



module.exports = router;