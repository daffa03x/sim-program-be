const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const programCategoryRoutes = require('./programCategory.routes');
const productRoutes = require('./product.routes');
const platformRoutes = require('./platform.routes');
const contributorRoutes = require('./contributor.routes');
const beneficiaryRoutes = require('./beneficiary.routes');
const campaignRoutes = require('./campaign.routes');
const dssRecordRoutes = require('./dssRecord.routes');
const importRoutes = require('./import.routes');

router.use('/auth', authRoutes);
router.use('/program-categories', programCategoryRoutes);
router.use('/products', productRoutes);
router.use('/platforms', platformRoutes);
router.use('/contributors', contributorRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/dss-records', dssRecordRoutes);
router.use('/import', importRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly'
  });
});

module.exports = router;
