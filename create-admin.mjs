import { Pool } from 'pg';
import { config } from 'dotenv';
import { hashPassword } from '@better-auth/utils/password';
import { v4 as uuidv4 } from 'uuid';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const email = 'mahmoudteirbusiness@gmail.com';
const password = '11111111';
const name = 'Admin Mahmoud';

async function createAdmin() {
  try {
    console.log('Generating hash...');
    const hash = await hashPassword(password);
    const userId = uuidv4().replace(/-/g, '').substring(0, 32); // generate a random ID
    const now = new Date();

    console.log('Creating user...');
    await pool.query(
      'INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [userId, name, email, true, null, 'ADMIN', now, now]
    );

    console.log('Creating account...');
    const accountId = uuidv4().replace(/-/g, '').substring(0, 32);
    await pool.query(
      'INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [accountId, userId, email, 'credential', hash, now, now]
    );

    console.log('\n✅ Admin account created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: ADMIN');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    pool.end();
  }
}

createAdmin();
