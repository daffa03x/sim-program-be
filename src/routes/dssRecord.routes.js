const express = require('express');
const router = express.Router();
const dssRecordController = require('../controllers/dssRecord.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createDssRecordSchema, updateDssRecordSchema } = require('../validations/dssRecord.validation');

router.use(requireAuth);

router.post('/', validate(createDssRecordSchema), dssRecordController.create);
router.get('/campaign/:campaignId', dssRecordController.getByCampaignId);
router.put('/campaign/:campaignId', validate(updateDssRecordSchema), dssRecordController.update);
router.delete('/campaign/:campaignId', dssRecordController.remove);

module.exports = router;
