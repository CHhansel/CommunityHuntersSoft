const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createContract,updateContract, updateContractState, getContractsByUserId } = require('../controllers/contract');

const router = Router();

router.post('/create-contract', createContract);
router.patch('/update-contract/:id', updateContract);
router.patch('/update-contract-state/:id', updateContractState);
router.get('/get-contracts/', getContractsByUserId);

module.exports = router;