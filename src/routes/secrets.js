const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new secret
router.post('/', protect, async (req, res) => {
  const { key, encryptedValue, description } = req.body;
  // In a real application, the value should be encrypted before storing.
  const secret = await prisma.secret.create({
    data: {
      key,
      encryptedValue,
      description,
    },
  });
  res.status(201).json(secret);
});

// Get all secrets
router.get('/', protect, async (req, res) => {
  const secrets = await prisma.secret.findMany();
  res.json(secrets);
});

module.exports = router;
