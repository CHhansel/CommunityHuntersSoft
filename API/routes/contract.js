const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { createContract,updateContract, updateContractState } = require('../controllers/contract');

const router = Router();

router.post('/create-contract', verifyPermissions, createContract);


// Ruta para actualizar propiedad, requiere autenticacion
router.patch('/update-contract/:id', verifyPermissions, updateContract);

router.patch('/update-contract-state/:id', verifyPermissions, updateContractState);

module.exports = router;