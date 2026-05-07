const { z } = require('zod');

const createPlatformSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    url: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal(''))
  })
});

const updatePlatformSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    url: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal(''))
  })
});

module.exports = {
  createPlatformSchema,
  updatePlatformSchema
};
