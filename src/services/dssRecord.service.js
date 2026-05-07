const prisma = require('../config/prisma');

const createDssRecord = async (data) => {
  const { allocation, realization, ...dssData } = data;

  const existing = await prisma.dssRecord.findUnique({
    where: { campaignId: dssData.campaignId }
  });

  if (existing) {
    const error = new Error('DSS Record already exists for this campaign');
    error.statusCode = 409;
    throw error;
  }

  return prisma.dssRecord.create({
    data: {
      ...dssData,
      allocation: allocation ? { create: allocation } : undefined,
      realization: realization ? { create: realization } : undefined
    },
    include: {
      allocation: true,
      realization: true
    }
  });
};

const getDssRecordByCampaignId = async (campaignId) => {
  const record = await prisma.dssRecord.findUnique({
    where: { campaignId: parseInt(campaignId) },
    include: {
      allocation: true,
      realization: true
    }
  });

  if (!record) {
    const error = new Error('DSS Record not found');
    error.statusCode = 404;
    throw error;
  }

  return record;
};

const updateDssRecord = async (campaignId, data) => {
  const { allocation, realization, ...dssData } = data;

  await getDssRecordByCampaignId(campaignId);

  return prisma.dssRecord.update({
    where: { campaignId: parseInt(campaignId) },
    data: {
      ...dssData,
      allocation: allocation ? {
        upsert: {
          create: allocation,
          update: allocation
        }
      } : undefined,
      realization: realization ? {
        upsert: {
          create: realization,
          update: realization
        }
      } : undefined
    },
    include: {
      allocation: true,
      realization: true
    }
  });
};

const deleteDssRecord = async (campaignId) => {
  await getDssRecordByCampaignId(campaignId);
  return prisma.dssRecord.delete({
    where: { campaignId: parseInt(campaignId) }
  });
};

module.exports = {
  createDssRecord,
  getDssRecordByCampaignId,
  updateDssRecord,
  deleteDssRecord
};
