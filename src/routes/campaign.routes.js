const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createCampaignSchema, updateCampaignSchema } = require('../validations/campaign.validation');

router.use(requireAuth);

router.post('/', validate(createCampaignSchema), campaignController.create);
router.get('/', campaignController.getAll);
router.get('/:id', campaignController.getById);
router.put('/:id', validate(updateCampaignSchema), campaignController.update);
router.delete('/:id', campaignController.remove);

module.exports = router;
