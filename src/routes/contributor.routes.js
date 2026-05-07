const express = require('express');
const router = express.Router();
const contributorController = require('../controllers/contributor.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createContributorSchema, updateContributorSchema } = require('../validations/contributor.validation');

router.use(requireAuth);

router.post('/', validate(createContributorSchema), contributorController.create);
router.get('/', contributorController.getAll);
router.get('/:id', contributorController.getById);
router.put('/:id', validate(updateContributorSchema), contributorController.update);
router.delete('/:id', contributorController.remove);

module.exports = router;
