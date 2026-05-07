const contributorService = require('../services/contributor.service');

const create = async (req, res, next) => {
  try {
    const contributor = await contributorService.createContributor(req.body);
    return res.status(201).json({
      success: true,
      message: 'Contributor created successfully',
      data: contributor
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const contributors = await contributorService.getAllContributors();
    return res.status(200).json({
      success: true,
      data: contributors
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contributor = await contributorService.getContributorById(req.params.id);
    return res.status(200).json({
      success: true,
      data: contributor
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const contributor = await contributorService.updateContributor(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Contributor updated successfully',
      data: contributor
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await contributorService.deleteContributor(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Contributor deleted successfully'
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
