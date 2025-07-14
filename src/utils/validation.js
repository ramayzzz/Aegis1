const { z } = require('zod');

const createProfileSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().max(1024).optional(),
});

module.exports = {
  createProfileSchema,
};
