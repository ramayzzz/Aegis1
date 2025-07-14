const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new task
router.post('/', protect, async (req, res) => {
  const { name, description, filePath } = req.body;
  const task = await prisma.task.create({
    data: {
      name,
      description,
      filePath,
    },
  });
  res.status(201).json(task);
});

// Get all tasks
router.get('/', protect, async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

module.exports = router;
