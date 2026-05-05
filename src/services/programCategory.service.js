const prisma = require('../config/prisma');

const createCategory = async (data) => {
  const existingCategory = await prisma.programCategory.findUnique({
    where: { name: data.name }
  });

  if (existingCategory) {
    const error = new Error('Category name already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.programCategory.create({
    data
  });
};

const getAllCategories = async () => {
  return prisma.programCategory.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.programCategory.findUnique({
    where: { id: parseInt(id) }
  });

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

const updateCategory = async (id, data) => {
  await getCategoryById(id); // Check existence

  if (data.name) {
    const existing = await prisma.programCategory.findUnique({
      where: { name: data.name }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Category name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.programCategory.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteCategory = async (id) => {
  await getCategoryById(id); // Check existence
  return prisma.programCategory.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
