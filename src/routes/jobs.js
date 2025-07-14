const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new job
router.post('/', protect, async (req, res) => {
  const { profileId, taskId, priority, inputData } = req.body;
  const job = await prisma.job.create({
    data: {
      profileId,
      taskId,
      priority,
      inputData,
    },
  });
  res.status(201).json(job);
});

// Get all jobs
router.get('/', protect, async (req, res) => {
  const jobs = await prisma.job.findMany();
  res.json(jobs);
});

module.exports = router;
