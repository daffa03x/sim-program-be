const { z } = require('zod');

const createBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional()
  })
});

const updateBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    description: z.string().optional()
  })
});

module.exports = {
  createBeneficiarySchema,
  updateBeneficiarySchema
};
