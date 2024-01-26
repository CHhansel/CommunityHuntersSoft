
const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { createEmployee, deleteEmployee, updateEmployee, getEmployeesByCompanyId } = require("../controllers/employees");



const router = Router();


router.get('/get-employees/' , getEmployeesByCompanyId);
router.post('/create-employee/' , createEmployee);
router.patch('/update-employee/', updateEmployee);
router.delete('/delete-employee/:id', deleteEmployee);
module.exports = router;