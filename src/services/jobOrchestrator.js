const PQueue = require('p-queue');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { runWorker } = require('./worker');

const queue = new PQueue({ concurrency: 1 }); // Start with a low concurrency

async function start(io) {
  // TODO: Add logic to resume jobs that were running on server restart
  console.log('Job orchestrator started');

  // Periodically check for new jobs
  setInterval(async () => {
    const jobs = await prisma.job.findMany({
      where: { status: 'queued' },
      orderBy: { priority: 'desc' },
    });

    for (const job of jobs) {
      const updatedJob = await prisma.job.update({
        where: { id: job.id },
        data: { status: 'running' },
      });
      io.emit('job:update', updatedJob);

      queue.add(async () => {
        console.log(`Starting job ${job.id}`);
        await runWorker(job);
        console.log(`Finished job ${job.id}`);
        const finishedJob = await prisma.job.update({
          where: { id: job.id },
          data: { status: 'completed' },
        });
        io.emit('job:update', finishedJob);
      });
    }
  }, 5000); // Check every 5 seconds
}

module.exports = { start };
