const { z } = require('zod');

const createContributorSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    phone: z.string().optional()
  })
});

const updateContributorSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    phone: z.string().optional()
  })
});

module.exports = {
  createContributorSchema,
  updateContributorSchema
};
