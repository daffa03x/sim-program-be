const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: 'Category name must be at least 2 characters long' }),
    description: z.string().optional()
  })
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: 'Category name must be at least 2 characters long' }).optional(),
    description: z.string().optional()
  })
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
