
const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { getEmployeesByUserId, createEmployee, updateEmployee } = require("../controllers/employee");




const router = Router();


router.get('/get-employees/', verifyPermissions, getEmployeesByUserId);
router.post('/create-employee/', verifyPermissions, createEmployee);
router.patch('/update-employee/', verifyPermissions, updateEmployee);
module.exports = router;