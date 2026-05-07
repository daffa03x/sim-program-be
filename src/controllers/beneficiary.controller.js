const beneficiaryService = require('../services/beneficiary.service');

const create = async (req, res, next) => {
  try {
    const beneficiary = await beneficiaryService.createBeneficiary(req.body);
    return res.status(201).json({
      success: true,
      message: 'Beneficiary created successfully',
      data: beneficiary
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const beneficiaries = await beneficiaryService.getAllBeneficiaries();
    return res.status(200).json({
      success: true,
      data: beneficiaries
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const beneficiary = await beneficiaryService.getBeneficiaryById(req.params.id);
    return res.status(200).json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const beneficiary = await beneficiaryService.updateBeneficiary(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Beneficiary updated successfully',
      data: beneficiary
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await beneficiaryService.deleteBeneficiary(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Beneficiary deleted successfully'
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
