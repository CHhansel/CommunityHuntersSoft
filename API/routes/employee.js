
const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { getEmployeesByUserId } = require("../controllers/employee");




const router = Router();


router.get('/get-employees/', verifyPermissions, getEmployeesByUserId);


module.exports = router;