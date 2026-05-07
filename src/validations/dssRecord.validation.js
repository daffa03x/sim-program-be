const { z } = require('zod');

const allocationSchema = z.object({
  operasionalProgramMitra: z.number().nonnegative().default(0),
  programNasional: z.number().nonnegative().default(0),
  pemberdayaan: z.number().nonnegative().default(0),
  sosialTrip: z.number().nonnegative().default(0)
});

const realizationSchema = z.object({
  sdmProgram: z.number().nonnegative().default(0),
  operasional: z.number().nonnegative().default(0),
  profil: z.number().nonnegative().default(0),
  total: z.number().nonnegative().default(0)
});

const createDssRecordSchema = z.object({
  body: z.object({
    campaignId: z.number().int().positive(),
    dss: z.number().nonnegative().default(0),
    profilPm: z.number().nonnegative().default(0),
    profilBaru: z.number().nonnegative().default(0),
    dssZa: z.number().nonnegative().default(0),
    noSppp: z.string().optional().or(z.literal('')),
    submitLaporan: z.enum(['Belum', 'Sudah']).default('Belum'),
    allocation: allocationSchema.optional(),
    realization: realizationSchema.optional()
  })
});

const updateDssRecordSchema = z.object({
  body: z.object({
    dss: z.number().nonnegative().optional(),
    profilPm: z.number().nonnegative().optional(),
    profilBaru: z.number().nonnegative().optional(),
    dssZa: z.number().nonnegative().optional(),
    noSppp: z.string().optional().or(z.literal('')).optional(),
    submitLaporan: z.enum(['Belum', 'Sudah']).optional(),
    allocation: allocationSchema.partial().optional(),
    realization: realizationSchema.partial().optional()
  })
});

module.exports = {
  createDssRecordSchema,
  updateDssRecordSchema
};
