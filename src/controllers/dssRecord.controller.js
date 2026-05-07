const dssRecordService = require('../services/dssRecord.service');

const create = async (req, res, next) => {
  try {
    const record = await dssRecordService.createDssRecord(req.body);
    return res.status(201).json({
      success: true,
      message: 'DSS Record created successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

const getByCampaignId = async (req, res, next) => {
  try {
    const record = await dssRecordService.getDssRecordByCampaignId(req.params.campaignId);
    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const record = await dssRecordService.updateDssRecord(req.params.campaignId, req.body);
    return res.status(200).json({
      success: true,
      message: 'DSS Record updated successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await dssRecordService.deleteDssRecord(req.params.campaignId);
    return res.status(200).json({
      success: true,
      message: 'DSS Record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getByCampaignId,
  update,
  remove
};
