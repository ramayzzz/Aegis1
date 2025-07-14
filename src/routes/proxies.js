const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new proxy
router.post('/', protect, async (req, res) => {
  const { host, port, username, password, protocol, country, tag } = req.body;
  const proxy = await prisma.proxy.create({
    data: {
      host,
      port,
      username,
      password,
      protocol,
      country,
      tag,
    },
  });
  res.status(201).json(proxy);
});

// Get all proxies
router.get('/', protect, async (req, res) => {
  const proxies = await prisma.proxy.findMany();
  res.json(proxies);
});

module.exports = router;
