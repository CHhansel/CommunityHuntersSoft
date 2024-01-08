const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createProperty, updateProperty, deleteProperty, updatePropertyContract } = require('../controllers/Property');
const { getPropertiesByCompanyId } = require("../controllers/propierties");


const router = Router();



router.post('/create-property', createProperty);
router.patch('/update-property/', updateProperty);
router.patch('/update-property-contract/', updatePropertyContract);
router.delete('/delete-property/:id', verifyPermissions, deleteProperty);
router.get('/get-properties/', getPropertiesByCopanyId);



module.exports = router;