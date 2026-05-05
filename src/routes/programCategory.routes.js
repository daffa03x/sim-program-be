const express = require('express');
const router = express.Router();
const programCategoryController = require('../controllers/programCategory.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validations/programCategory.validation');

// Require authentication for all category routes
router.use(requireAuth);

router.post('/', validate(createCategorySchema), programCategoryController.create);
router.get('/', programCategoryController.getAll);
router.get('/:id', programCategoryController.getById);
router.put('/:id', validate(updateCategorySchema), programCategoryController.update);
router.delete('/:id', programCategoryController.remove);

module.exports = router;
