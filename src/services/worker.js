const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function createStealthBrowserContext(profileId) {
  const profileDir = path.join(__dirname, '..', '..', 'data', 'profiles', profileId);
  const fingerprint = JSON.parse(await fs.readFile(path.join(profileDir, 'fingerprint.json'), 'utf-8'));
  const state = JSON.parse(await fs.readFile(path.join(profileDir, 'state.json'), 'utf-8'));

  // TODO: Add proxy support
  const browser = await playwright.chromium.launch({
    headless: false, // For debugging
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--disable-popup-blocking',
      '--disable-notifications',
    ],
  });

  const context = await browser.newContext({
    ...fingerprint,
    storageState: state,
  });

  return context;
}

const logger = require('../utils/logger');
const archiver = require('archiver');

async function runWorker(job) {
  const context = await createStealthBrowserContext(job.profileId);
  const page = await context.newPage();
  const taskPath = path.join(__dirname, '..', '..', 'tasks', job.taskId + '.js');
  const task = require(taskPath);
  const profileDir = path.join(__dirname, '..', '..', 'data', 'profiles', job.profileId);
  const forensicDir = path.join(profileDir, 'forensics', job.id);
  await fs.mkdir(forensicDir, { recursive: true });


  const jobLogger = logger.child({ jobId: job.id });

  try {
    const human = require('./human');
    const captcha = require('./captcha');
    const secrets = {
      get: async (key) => {
        const secret = await prisma.secret.findUnique({ where: { key } });
        // In a real application, the value should be decrypted before returning.
        return secret?.encryptedValue;
      }
    };

    await task.run({
      page,
      context,
      human,
      data: job.inputData,
      secrets,
      logger: jobLogger,
      captcha,
    });

    // Save the context state
    const state = await context.storageState();
    await fs.writeFile(path.join(profileDir, 'state.json'), JSON.stringify(state, null, 2));

    await context.close();
  } catch (error) {
    jobLogger.error('Unhandled exception in job', { error: error.stack });

    // Generate forensic package
    const snapshotPath = path.join(forensicDir, 'snapshot.html');
    const screenshotPath = path.join(forensicDir, 'screenshot.png');
    const videoPath = await page.video().path();
    const logPath = path.join(forensicDir, 'console.log');

    await page.screenshot({ path: screenshotPath, fullPage: true });
    const html = await page.content();
    await fs.writeFile(snapshotPath, html);
    await fs.copyFile(videoPath, path.join(forensicDir, 'video.webm'));
    // TODO: Capture console logs

    const forensicPackagePath = path.join(profileDir, 'forensics', `${job.id}.zip`);
    const output = fs.createWriteStream(forensicPackagePath);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(forensicDir, false);
    await archive.finalize();


    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        logPath: logPath,
        videoPath: path.join(forensicDir, 'video.webm'),
        snapshotPath: snapshotPath,
      },
    });
  }
}

module.exports = { runWorker };
