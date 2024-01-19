const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { updatePropertyContract } = require('../controllers/Property');
const { getPropertiesByCompanyId, insertProperty, updateProperty, deleteProperty } = require("../controllers/properties");


const router = Router();



router.post('/create-property', insertProperty);
router.patch('/update-property/', updateProperty);
router.patch('/update-property-contract/', updatePropertyContract);
router.delete('/delete-property/:id', deleteProperty);
router.get('/get-properties/', getPropertiesByCompanyId);



module.exports = router;