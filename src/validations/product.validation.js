const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    categoryId: z.number().int().positive({ message: 'Valid Category ID is required' })
  })
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    description: z.string().optional(),
    categoryId: z.number().int().positive({ message: 'Valid Category ID is required' }).optional()
  })
});

module.exports = {
  createProductSchema,
  updateProductSchema
};
