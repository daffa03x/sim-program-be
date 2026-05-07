const importService = require('../services/import.service');
const fs = require('fs');

const importExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const results = await importService.importFromExcel(filePath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: 'Import completed',
      data: results
    });
  } catch (error) {
    // Ensure file is deleted even on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  importExcel
};
