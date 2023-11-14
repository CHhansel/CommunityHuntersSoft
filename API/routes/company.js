const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { updateCompanyInfo,createCompanyCredentials, getCompanyCredentialsByCompanyId } = require('../controllers/company');

const router = Router();

router.post('/create-company-credentials', createCompanyCredentials);
router.patch('/update-update-company-info/:id', updateCompanyInfo);
router.get('/get-company-credentials/', getCompanyCredentialsByCompanyId);

module.exports = router;
