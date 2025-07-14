const { ghost } = require('ghost-cursor');

async function type(page, selector, text, { typingSpeed = 'average' }) {
  let delay;
  switch (typingSpeed) {
    case 'fast':
      delay = 50;
      break;
    case 'average':
      delay = 100;
      break;
    case 'slow':
      delay = 200;
      break;
    default:
      delay = 100;
  }
  await page.type(selector, text, { delay });
}

async function click(page, selector) {
  const cursor = ghost(page);
  await cursor.click(selector);
}

async function browse(page, { minIdle = 1000, maxIdle = 5000 }) {
  const idleTime = Math.random() * (maxIdle - minIdle) + minIdle;
  await page.waitForTimeout(idleTime);
}

module.exports = {
  type,
  click,
  browse,
};
