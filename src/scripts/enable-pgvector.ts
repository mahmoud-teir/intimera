import { db } from '../lib/db';

async function main() {
  try {
    await db.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('Successfully enabled pgvector extension.');
  } catch (error) {
    console.error('Failed to enable pgvector:', error);
  }
}

main();
