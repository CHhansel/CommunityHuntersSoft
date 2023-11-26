const { Router } = require("express");




const { createInvoice } = require('../controllers/MHRequests');

const router = Router();

router.post('/create-invoice/', createInvoice);


module.exports = router;