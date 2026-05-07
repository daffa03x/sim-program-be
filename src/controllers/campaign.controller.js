const campaignService = require('../services/campaign.service');

const create = async (req, res, next) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    return res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await campaignService.getAllCampaigns(req.query);
    return res.status(200).json({
      success: true,
      data: result.campaigns,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    return res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const campaign = await campaignService.updateCampaign(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await campaignService.deleteCampaign(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
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
