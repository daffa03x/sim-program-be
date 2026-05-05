const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly'
  });
});

module.exports = router;
