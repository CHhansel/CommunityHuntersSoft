const { Router } = require("express");


const {  getAllPaymentMethods, getAllSaleCondition } = require('../controllers/billing');

const router = Router();


router.get('/get-all-payment-methods', getAllPaymentMethods);
router.get('/get-all-sale-conditions', getAllSaleCondition);

module.exports = router;