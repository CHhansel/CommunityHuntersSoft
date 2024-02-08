const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { insertProductCategory, getCategoriesByCompanyId, updateProductCategory, deleteProductCategoryAndRelationsById, getRelationsByCompanyId } = require("../controllers/categories");


const router = Router();



router.post('/create-category', insertProductCategory);
router.get('/get-categories/', getCategoriesByCompanyId);
router.patch('/update-category/:id', updateProductCategory);
router.delete('/delete-category/:id', deleteProductCategoryAndRelationsById);
router.get('/get-relations/', getRelationsByCompanyId);



module.exports = router;