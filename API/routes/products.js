const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { deleteProduct,getProductsByCompanyId,insertProduct, updateProduct } = require("../controllers/products");


const router = Router();



router.post('/create-product', insertProduct);
router.delete('/delete-product/:id', deleteProduct);
router.patch('/update-product/:id', updateProduct);
router.get('/get-products/', getProductsByCompanyId);



module.exports = router;


