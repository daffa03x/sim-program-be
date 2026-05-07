const prisma = require('../config/prisma');

const createProduct = async (data) => {
  const existing = await prisma.product.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    const error = new Error('Product name already exists');
    error.statusCode = 409;
    throw error;
  }

  // Check if category exists
  const category = await prisma.programCategory.findUnique({
    where: { id: data.categoryId }
  });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.create({
    data
  });
};

const getAllProducts = async () => {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true }
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const updateProduct = async (id, data) => {
  await getProductById(id);

  if (data.name) {
    const existing = await prisma.product.findUnique({
      where: { name: data.name }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Product name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  if (data.categoryId) {
    const category = await prisma.programCategory.findUnique({
      where: { id: data.categoryId }
    });
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.product.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteProduct = async (id) => {
  await getProductById(id);
  return prisma.product.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
