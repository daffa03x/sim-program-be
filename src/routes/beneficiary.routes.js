const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiary.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createBeneficiarySchema, updateBeneficiarySchema } = require('../validations/beneficiary.validation');

router.use(requireAuth);

router.post('/', validate(createBeneficiarySchema), beneficiaryController.create);
router.get('/', beneficiaryController.getAll);
router.get('/:id', beneficiaryController.getById);
router.put('/:id', validate(updateBeneficiarySchema), beneficiaryController.update);
router.delete('/:id', beneficiaryController.remove);

module.exports = router;
