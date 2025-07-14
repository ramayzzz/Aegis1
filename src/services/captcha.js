const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function solveRecaptchaV2({ page, siteKey }) {
  const job = page.job; // This assumes the job is attached to the page object
  const settings = await prisma.setting.findMany();
  const captchaProvider = settings.find(s => s.key === 'captchaProvider')?.value;
  const captchaApiKey = settings.find(s => s.key === 'captchaApiKey')?.value;

  if (!captchaProvider || !captchaApiKey) {
    throw new Error('Captcha provider or API key not configured');
  }

  const captchaRequest = await prisma.captchaRequest.create({
    data: {
      jobId: job.id,
      siteUrl: page.url(),
      siteKey,
    },
  });

  // In a real implementation, you would make an API call to the captcha provider here.
  // For now, we'll just simulate a successful response.
  const solutionToken = 'mock-captcha-solution-token';

  await prisma.captchaRequest.update({
    where: { id: captchaRequest.id },
    data: { status: 'solved', solutionToken },
  });

  return solutionToken;
}

module.exports = {
  solveRecaptchaV2,
};
