const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createProfileSchema } = require('../utils/validation');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to validate with Zod
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const { createProfileFileSystem } = require('../services/profileManager');

// Create a new profile
router.post('/', protect, validate(createProfileSchema), async (req, res) => {
  const { name, description } = req.body;
  const profile = await prisma.profile.create({
    data: {
      name,
      description,
    },
  });

  try {
    await createProfileFileSystem(profile.id);
  } catch (error) {
    console.error('Failed to create profile file system:', error);
    // Rollback profile creation if file system setup fails
    await prisma.profile.delete({ where: { id: profile.id } });
    return res.status(500).json({ message: 'Failed to create profile file system' });
  }

  res.status(201).json(profile);
});

// Get all profiles
router.get('/', protect, async (req, res) => {
  const profiles = await prisma.profile.findMany();
  res.json(profiles);
});

module.exports = router;
