const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createProductSchema, updateProductSchema } = require('../validations/product.validation');

router.use(requireAuth);

router.post('/', validate(createProductSchema), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
