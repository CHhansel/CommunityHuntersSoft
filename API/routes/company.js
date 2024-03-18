const { Router } = require("express");



const verifyPermissions = require('../middlewares/authenticateToken');
const { updateCompanyInfo,createCompanyCredentials, getCompanyCredentialsByCompanyId, getCompanyData } = require('../controllers/company');

const router = Router();

router.post('/create-company-credentials', createCompanyCredentials);
router.patch('/update-update-company-info/:id', updateCompanyInfo);
router.get('/get-company-credentials/:company_id', getCompanyCredentialsByCompanyId);
router.get('/get-company-data/:companyId', getCompanyData);


module.exports = router;
