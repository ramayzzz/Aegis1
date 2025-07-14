module.exports = {
  run: async ({ page, human, data, logger }) => {
    logger.info('Navigating to website');
    await page.goto('https://www.google.com');

    logger.info('Typing in search box');
    await human.type(page, 'input[name="q"]', 'SvelteKit', { typingSpeed: 'fast' });

    logger.info('Clicking search button');
    await human.click(page, 'input[name="btnK"]');

    logger.info('Waiting for navigation');
    await page.waitForNavigation();

    logger.info('Task finished');
  },
};
