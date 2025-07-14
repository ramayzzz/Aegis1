const { execSync } = require('child_process');

try {
  execSync('cd frontend && npx tailwindcss init -p', { stdio: 'inherit' });
} catch (error) {
  console.error('Tailwind init failed:', error);
  process.exit(1);
}
