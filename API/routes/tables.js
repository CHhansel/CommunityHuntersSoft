const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');

const { insertRestaurantTable, getRestaurantTablesByCompany, updateRestaurantTable,deleteRestaurantTableById } = require("../controllers/tables");


const router = Router();



router.post('/create-table', insertRestaurantTable);
router.get('/get-tables/', getRestaurantTablesByCompany);
router.patch('/update-table/:id', updateRestaurantTable);
router.delete('/delete-table/:id', deleteRestaurantTableById);


module.exports = router;