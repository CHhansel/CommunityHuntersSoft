const { Router } = require("express");



const { searchCabys, getAllCat1DescCabys, getCat2DescByCat1Cabys } = require('../controllers/cabys'); // Ajusta la ruta según la ubicación de tu archivo de controlador

const router = Router();

router.get('/search', searchCabys);
router.get('/categories', getAllCat1DescCabys);
router.get('/subcategories1/:cat2', getCat2DescByCat1Cabys);

module.exports = router;