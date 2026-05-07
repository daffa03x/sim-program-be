const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const importController = require('../controllers/import.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!require('fs').existsSync(uploadDir)) {
      require('fs').mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx') {
      return cb(new Error('Only .xlsx files are allowed'), false);
    }
    cb(null, true);
  }
});

router.use(requireAuth);

router.post('/', upload.single('file'), importController.importExcel);

module.exports = router;
