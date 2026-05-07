const { z } = require('zod');

// Accept ISO datetime, YYYY-MM-DD, or any valid date string
const dateString = z.string().refine((val) => !isNaN(new Date(val).getTime()), {
  message: 'Invalid date format'
});

const createCampaignSchema = z.object({
  body: z.object({
    campaignExtId: z.number().int().positive(),
    name: z.string().min(1),
    link: z.string().optional(),
    period: dateString,
    productId: z.number().int().positive(),
    platformId: z.number().int().positive().optional(),
    beneficiaryId: z.number().int().positive().optional(),
    contributorId: z.number().int().positive().optional(),
    pmUserId: z.number().int().positive().optional(),
    capaian: z.number().nonnegative().default(0),
    danaCair: z.number().nonnegative().default(0),
    pencairan: z.number().nonnegative().default(0),
    dpProgram: z.number().nonnegative().default(0)
  })
});

const updateCampaignSchema = z.object({
  body: z.object({
    campaignExtId: z.number().int().positive().optional(),
    name: z.string().min(1).optional(),
    link: z.string().optional(),
    period: dateString.optional(),
    productId: z.number().int().positive().optional(),
    platformId: z.number().int().positive().optional(),
    beneficiaryId: z.number().int().positive().optional(),
    contributorId: z.number().int().positive().optional(),
    pmUserId: z.number().int().positive().optional(),
    capaian: z.number().nonnegative().optional(),
    danaCair: z.number().nonnegative().optional(),
    pencairan: z.number().nonnegative().optional(),
    dpProgram: z.number().nonnegative().optional()
  })
});

module.exports = {
  createCampaignSchema,
  updateCampaignSchema
};
