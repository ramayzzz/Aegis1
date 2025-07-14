const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.task.create({
    data: {
      name: 'Sample Task',
      description: 'A sample task to test the framework',
      filePath: 'sample-task.js',
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
