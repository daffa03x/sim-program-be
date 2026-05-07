const prisma = require('../config/prisma');

const createBeneficiary = async (data) => {
  const existing = await prisma.beneficiary.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    const error = new Error('Beneficiary name already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.beneficiary.create({
    data
  });
};

const getAllBeneficiaries = async () => {
  return prisma.beneficiary.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

const getBeneficiaryById = async (id) => {
  const beneficiary = await prisma.beneficiary.findUnique({
    where: { id: parseInt(id) }
  });

  if (!beneficiary) {
    const error = new Error('Beneficiary not found');
    error.statusCode = 404;
    throw error;
  }

  return beneficiary;
};

const updateBeneficiary = async (id, data) => {
  await getBeneficiaryById(id);

  if (data.name) {
    const existing = await prisma.beneficiary.findUnique({
      where: { name: data.name }
    });
    if (existing && existing.id !== parseInt(id)) {
      const error = new Error('Beneficiary name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.beneficiary.update({
    where: { id: parseInt(id) },
    data
  });
};

const deleteBeneficiary = async (id) => {
  await getBeneficiaryById(id);
  return prisma.beneficiary.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary
};
