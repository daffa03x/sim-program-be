const prisma = require('../config/prisma');

const createPlatform = async (data) => {
  const existing = await prisma.platform.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    const error = new Error('Platform name already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.platform.create({
    data
  });
};

const getAllPlatforms = async () => {
  return prisma.platform.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

const getPlatformById = async (id) => {
  const platform = await prisma.platform.findUnique({
    where: { id: parseInt(id) }
  });

  if (!platform) {
    const error = new Error('Platform not found');
    error.statusCode = 404;
    throw error;
  }

  return platform;
};

const updatePlatform = async (id, data) => {
  await getPlatformById(id);

  if (data.name) {
    const existing = await prisma.platform.findUnique({
      where: { name: data.name }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Platform name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.platform.update({
    where: { id: parseInt(id) },
    data
  });
};

const deletePlatform = async (id) => {
  await getPlatformById(id);
  return prisma.platform.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createPlatform,
  getAllPlatforms,
  getPlatformById,
  updatePlatform,
  deletePlatform
};
