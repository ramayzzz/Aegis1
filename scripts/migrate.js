require(process.cwd() + '/node_modules/dotenv').config();
const { execSync } = require('child_process');

console.log('NODE_PATH:', process.env.NODE_PATH);

try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
