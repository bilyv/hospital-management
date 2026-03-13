require('dotenv').config();
const { initializeDatabase } = require('../src/utils/dbInit');

async function main() {
  try {
    console.log('Starting manual database setup...');
    await initializeDatabase();
    console.log('Database setup complete.');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

main();