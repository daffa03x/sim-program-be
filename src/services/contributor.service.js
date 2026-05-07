const prisma = require('../config/prisma');

const createContributor = async (data) => {
  const existing = await prisma.contributor.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    const error = new Error('Contributor name already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.contributor.create({
    data
  });
};

const getAllContributors = async () => {
  return prisma.contributor.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

const getContributorById = async (id) => {
  const contributor = await prisma.contributor.findUnique({
    where: { id: parseInt(id) }
  });

  if (!contributor) {
    const error = new Error('Contributor not found');
    error.statusCode = 404;
    throw error;
  }

  return contributor;
};

const updateContributor = async (id, data) => {
  await getContributorById(id);

  if (data.name) {
    const existing = await prisma.contributor.findUnique({
      where: { name: data.name }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Contributor name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.contributor.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteContributor = async (id) => {
  await getContributorById(id);
  return prisma.contributor.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createContributor,
  getAllContributors,
  getContributorById,
  updateContributor,
  deleteContributor
};
