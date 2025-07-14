const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new scheduled job
router.post('/', protect, async (req, res) => {
  const { name, cronString, profileId, taskId, priority, inputData } = req.body;
  const scheduledJob = await prisma.scheduledJob.create({
    data: {
      name,
      cronString,
      profileId,
      taskId,
      priority,
      inputData,
    },
  });
  res.status(201).json(scheduledJob);
});

// Get all scheduled jobs
router.get('/', protect, async (req, res) => {
  const scheduledJobs = await prisma.scheduledJob.findMany();
  res.json(scheduledJobs);
});

module.exports = router;
