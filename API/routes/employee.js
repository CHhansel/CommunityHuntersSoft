
const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { getEmployeesByUserId, createEmployee, updateEmployee } = require("../controllers/employee");




const router = Router();


router.get('/get-employees/' , getEmployeesByUserId);
router.post('/create-employee/' , createEmployee);
router.patch('/update-employee/' , updateEmployee);
module.exports = router;