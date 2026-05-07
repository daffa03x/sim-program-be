const prisma = require('../config/prisma');

const createCampaign = async (data) => {
  const existing = await prisma.campaign.findUnique({
    where: { campaignExtId: data.campaignExtId }
  });

  if (existing) {
    const error = new Error('Campaign External ID already exists');
    error.statusCode = 409;
    throw error;
  }

  // Ensure period is a Date object
  if (data.period) {
    data.period = new Date(data.period);
  }

  return prisma.campaign.create({
    data
  });
};

const getAllCampaigns = async (filters = {}) => {
  const { page = 1, limit = 10, search, month, year } = filters;
  const skip = (page - 1) * limit;

  let where = {};
  if (search) {
    where.name = { contains: search };
  }
  
  if (month || year) {
    // Basic filter for period (assuming period is stored as Date)
    // For more complex date filtering, we'd need to calculate start/end of month
  }

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        product: { include: { category: true } },
        platform: true,
        beneficiary: true,
        contributor: true,
        pmUser: { select: { id: true, name: true, email: true } },
        dssRecord: {
          include: {
            allocation: true,
            realization: true
          }
        }
      },
      orderBy: { period: 'desc' }
    }),
    prisma.campaign.count({ where })
  ]);

  return {
    campaigns,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getCampaignById = async (id) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: parseInt(id) },
    include: {
      product: { include: { category: true } },
      platform: true,
      beneficiary: true,
      contributor: true,
      pmUser: { select: { id: true, name: true, email: true } },
      dssRecord: {
        include: {
          allocation: true,
          realization: true
        }
      }
    }
  });

  if (!campaign) {
    const error = new Error('Campaign not found');
    error.statusCode = 404;
    throw error;
  }

  return campaign;
};

const updateCampaign = async (id, data) => {
  await getCampaignById(id);

  if (data.campaignExtId) {
    const existing = await prisma.campaign.findUnique({
      where: { campaignExtId: data.campaignExtId }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Campaign External ID already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  if (data.period) {
    data.period = new Date(data.period);
  }

  return prisma.campaign.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteCampaign = async (id) => {
  await getCampaignById(id);
  return prisma.campaign.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
};
