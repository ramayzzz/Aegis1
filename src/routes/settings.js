const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create or update a setting
router.post('/', protect, async (req, res) => {
  const { key, value } = req.body;
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.status(201).json(setting);
});

// Get a setting by key
router.get('/:key', protect, async (req, res) => {
  const { key } = req.params;
  const setting = await prisma.setting.findUnique({
    where: { key },
  });
  res.json(setting);
});

module.exports = router;
