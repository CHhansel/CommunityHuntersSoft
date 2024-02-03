const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { insertProductCategory, getCategoriesByCompanyId } = require("../controllers/categories");


const router = Router();



router.post('/create-category', insertProductCategory);
router.get('/get-categories/', getCategoriesByCompanyId);



module.exports = router;