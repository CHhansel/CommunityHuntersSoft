const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { deleteProduct,getProductsByCompanyId,insertProduct } = require("../controllers/products");


const router = Router();



router.post('/create-product', insertProduct);
//router.patch('/update-property/', updateProperty);
router.delete('/delete-product/:id', deleteProduct);
router.get('/get-products/', getProductsByCompanyId);



module.exports = router;