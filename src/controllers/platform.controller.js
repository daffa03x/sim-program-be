const platformService = require('../services/platform.service');

const create = async (req, res, next) => {
  try {
    const platform = await platformService.createPlatform(req.body);
    return res.status(201).json({
      success: true,
      message: 'Platform created successfully',
      data: platform
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const platforms = await platformService.getAllPlatforms();
    return res.status(200).json({
      success: true,
      data: platforms
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const platform = await platformService.getPlatformById(req.params.id);
    return res.status(200).json({
      success: true,
      data: platform
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const platform = await platformService.updatePlatform(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Platform updated successfully',
      data: platform
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await platformService.deletePlatform(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Platform deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
