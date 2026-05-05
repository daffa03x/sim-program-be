const programCategoryService = require('../services/programCategory.service');

const create = async (req, res, next) => {
  try {
    const category = await programCategoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const categories = await programCategoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await programCategoryService.getCategoryById(req.params.id);
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await programCategoryService.updateCategory(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await programCategoryService.deleteCategory(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
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
