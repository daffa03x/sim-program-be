const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createPlatformSchema, updatePlatformSchema } = require('../validations/platform.validation');

router.use(requireAuth);

router.post('/', validate(createPlatformSchema), platformController.create);
router.get('/', platformController.getAll);
router.get('/:id', platformController.getById);
router.put('/:id', validate(updatePlatformSchema), platformController.update);
router.delete('/:id', platformController.remove);

module.exports = router;
