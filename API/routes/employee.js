
const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { createEmployee, deleteEmployee, updateEmployee, getEmployeesByCompanyId,getEmployeesByModuleAndCompany } = require("../controllers/employees");



const router = Router();


router.get('/get-employees/' , getEmployeesByCompanyId);
router.get('/get-employees-by-module/' , getEmployeesByModuleAndCompany);
router.post('/create-employee/' , createEmployee);
router.patch('/update-employee/', updateEmployee);
router.delete('/delete-employee/:id', deleteEmployee);
module.exports = router;